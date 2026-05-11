#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = process.cwd();
const automationDir = path.join(rootDir, 'automation');
const scriptsAutomationDir = path.join(rootDir, 'scripts', 'automation');
const packageJsonPath = path.join(rootDir, 'package.json');
const ecosystemPath = path.join(rootDir, 'ecosystem.config.cjs');
const packageScriptDuplicatesCheckPath = path.join(
  rootDir,
  'scripts',
  'automation',
  'check-package-script-duplicates.cjs'
);
const workflowIssueDedupeContractPath = path.join(
  rootDir,
  'scripts',
  'automation',
  'validate-workflow-issue-dedupe-contract.cjs'
);
const pinActionsWeeklyPath = path.join(rootDir, 'scripts', 'automation', 'pin-actions-weekly.cjs');
const pinActionsReportPath = path.join(rootDir, 'automation', 'reports', 'pin-actions-weekly-report.json');
const runtimeDirs = ['logs', 'reports', 'data'];
const ignoredDirs = new Set(['node_modules', '.git', '.next', 'dist', 'build', ...runtimeDirs]);

function ensureRuntimeDirs() {
  for (const dir of runtimeDirs) {
    fs.mkdirSync(path.join(automationDir, dir), { recursive: true });
  }
}

function walkScriptFiles(baseDir, fileCollector = []) {
  if (!fs.existsSync(baseDir)) {
    return fileCollector;
  }

  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        walkScriptFiles(fullPath, fileCollector);
      }
      continue;
    }

    if (entry.isFile() && (entry.name.endsWith('.cjs') || entry.name.endsWith('.js'))) {
      fileCollector.push(fullPath);
    }
  }

  return fileCollector;
}

function checkSyntax(absolutePath) {
  const relativePath = path.relative(rootDir, absolutePath);
  const result = spawnSync(process.execPath, ['--check', relativePath], {
    cwd: rootDir,
    encoding: 'utf8',
  });

  return {
    script: relativePath,
    success: result.status === 0,
    stderr: result.stderr || '',
    stdout: result.stdout || '',
  };
}

function listRubyAutomationScripts() {
  if (!fs.existsSync(scriptsAutomationDir)) {
    return [];
  }
  return fs
    .readdirSync(scriptsAutomationDir)
    .filter((name) => name.endsWith('.rb'))
    .map((name) => path.join(scriptsAutomationDir, name));
}

function rubyOnPath() {
  const result = spawnSync('ruby', ['--version'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  if (result.error && result.error.code === 'ENOENT') {
    return false;
  }
  return result.status === 0;
}

function checkRubySyntax(absolutePath) {
  const relativePath = path.relative(rootDir, absolutePath);
  const result = spawnSync('ruby', ['-c', relativePath], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  return {
    script: relativePath,
    success: result.status === 0,
    stderr: result.stderr || '',
    stdout: result.stdout || '',
  };
}

function listShellAutomationScripts() {
  if (!fs.existsSync(scriptsAutomationDir)) {
    return [];
  }
  return fs
    .readdirSync(scriptsAutomationDir)
    .filter((name) => name.endsWith('.sh'))
    .map((name) => path.join(scriptsAutomationDir, name));
}

function bashOnPath() {
  const result = spawnSync('bash', ['-c', 'echo ok'], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  if (result.error && result.error.code === 'ENOENT') {
    return false;
  }
  return result.status === 0;
}

function checkShellSyntax(absolutePath) {
  const relativePath = path.relative(rootDir, absolutePath);
  const result = spawnSync('bash', ['-n', relativePath], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  return {
    script: relativePath,
    success: result.status === 0,
    stderr: result.stderr || '',
    stdout: result.stdout || '',
  };
}

function normalizeCommandPath(rawPath) {
  if (!rawPath) {
    return null;
  }

  const trimmed = rawPath.trim().replace(/^["']|["']$/g, '');
  const clean = trimmed.replace(/[;|&]+$/, '');
  if (!clean || clean.includes('$')) {
    return null;
  }
  return clean;
}

function isLocalPath(commandPath) {
  return (
    commandPath.startsWith('./') ||
    commandPath.startsWith('automation/') ||
    commandPath.startsWith('scripts/') ||
    commandPath.endsWith('.sh')
  );
}

function loadJson(jsonPath) {
  return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

function loadEcosystem() {
  if (!fs.existsSync(ecosystemPath)) {
    return { failures: [{ type: 'ecosystem', message: 'ecosystem.config.cjs not found' }], appNames: new Set() };
  }

  try {
    const ecosystem = require(ecosystemPath);
    const apps = Array.isArray(ecosystem.apps) ? ecosystem.apps : [];
    const appNames = new Set();
    const duplicateNames = new Set();
    const failures = [];

    for (const app of apps) {
      if (!app || typeof app !== 'object') {
        continue;
      }

      if (typeof app.name === 'string') {
        if (appNames.has(app.name)) {
          duplicateNames.add(app.name);
        }
        appNames.add(app.name);
      }

      if (typeof app.script === 'string') {
        const scriptPath = app.script.trim();
        const isPathLike =
          scriptPath.startsWith('./') ||
          scriptPath.startsWith('automation/') ||
          scriptPath.startsWith('scripts/');

        if (isPathLike) {
          const absoluteScriptPath = path.resolve(rootDir, scriptPath);
          if (!fs.existsSync(absoluteScriptPath)) {
            failures.push({
              type: 'ecosystem-script',
              appName: app.name || '<unnamed>',
              message: `Missing script path: ${scriptPath}`,
            });
          }
        }
      }
    }

    for (const duplicateName of duplicateNames) {
      failures.push({
        type: 'ecosystem-name',
        appName: duplicateName,
        message: `Duplicate PM2 app name: ${duplicateName}`,
      });
    }

    return { failures, appNames };
  } catch (error) {
    return {
      failures: [{ type: 'ecosystem', message: `Failed to load ecosystem config: ${error.message}` }],
      appNames: new Set(),
    };
  }
}

function auditPackageScripts(appNames) {
  const failures = [];
  if (!fs.existsSync(packageJsonPath)) {
    failures.push({ type: 'package', message: 'package.json not found' });
    return failures;
  }

  const packageJson = loadJson(packageJsonPath);
  const scripts = packageJson.scripts || {};

  for (const [scriptName, command] of Object.entries(scripts)) {
    if (typeof command !== 'string') {
      continue;
    }

    const pathRegex = /(?:node|bash|sh)\s+([^\s"'`]+)|(\.\/[^\s"'`]+)/g;
    for (const match of command.matchAll(pathRegex)) {
      const candidate = normalizeCommandPath(match[1] || match[2]);
      if (!candidate || !isLocalPath(candidate)) {
        continue;
      }

      const absolutePath = path.resolve(rootDir, candidate);
      if (!fs.existsSync(absolutePath)) {
        failures.push({
          type: 'package-script-path',
          scriptName,
          message: `Missing referenced path: ${candidate}`,
        });
      }
    }

    const pm2OnlyRegex = /pm2\s+start\s+ecosystem\.config\.cjs\s+--only\s+([a-zA-Z0-9_-]+)/g;
    for (const match of command.matchAll(pm2OnlyRegex)) {
      const appName = match[1];
      if (!appNames.has(appName)) {
        failures.push({
          type: 'package-script-pm2',
          scriptName,
          appName,
          message: `Unknown PM2 app name: ${appName}`,
        });
      }
    }
  }

  return failures;
}

function listShellScripts(baseDir) {
  if (!fs.existsSync(baseDir)) {
    return [];
  }
  return fs
    .readdirSync(baseDir)
    .filter((entry) => entry.endsWith('.sh'))
    .map((entry) => path.join(baseDir, entry));
}

function auditShellPm2Targets(appNames) {
  const failures = [];
  const shellScripts = [
    ...listShellScripts(automationDir),
    ...listShellScripts(rootDir),
  ];

  const pm2OnlyRegex = /--only\s+([a-zA-Z0-9_-]+)/g;
  for (const scriptPath of shellScripts) {
    const content = fs.readFileSync(scriptPath, 'utf8');
    const relativeScript = path.relative(rootDir, scriptPath);
    for (const match of content.matchAll(pm2OnlyRegex)) {
      const appName = match[1];
      if (!appNames.has(appName)) {
        failures.push({
          type: 'shell-script-pm2',
          scriptName: relativeScript,
          appName,
          message: `Unknown PM2 app name: ${appName}`,
        });
      }
    }
  }

  return failures;
}

function printAuditFailure(prefix, failure) {
  const location = failure.scriptName ? ` [${failure.scriptName}]` : '';
  const appName = failure.appName ? ` (${failure.appName})` : '';
  console.error(`${prefix}${location}${appName}: ${failure.message}`);
}

/**
 * Escalation workflows should use scripts/automation/gh-issue-dedupe-or-create.cjs
 * so scheduled jobs do not open duplicate issues. Raw `gh issue create` is forbidden.
 */
function checkWorkflowIssueDedupe() {
  const wfDir = path.join(rootDir, '.github', 'workflows');
  if (!fs.existsSync(wfDir)) {
    return [];
  }

  const failures = [];
  for (const name of fs.readdirSync(wfDir)) {
    if (!name.endsWith('.yml') && !name.endsWith('.yaml')) {
      continue;
    }
    const full = path.join(wfDir, name);
    const lines = fs.readFileSync(full, 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith('#')) {
        continue;
      }
      if (/\bgh issue create\b/.test(trimmed)) {
        failures.push({ file: name, line: i + 1, text: trimmed.slice(0, 120) });
      }
    }
  }
  return failures;
}

function main() {
  ensureRuntimeDirs();

  const automationScripts = walkScriptFiles(automationDir);
  const orchestrationScripts = walkScriptFiles(scriptsAutomationDir);
  const allScripts = [...new Set([...automationScripts, ...orchestrationScripts])].sort();

  if (allScripts.length === 0) {
    console.error('Automation preflight failed: no automation scripts found.');
    process.exit(1);
  }

  const syntaxFailures = [];
  for (const scriptPath of allScripts) {
    const result = checkSyntax(scriptPath);
    if (!result.success) {
      syntaxFailures.push(result);
    }
  }

  const rubyScripts = listRubyAutomationScripts();
  let rubyChecked = 0;
  if (rubyScripts.length > 0) {
    if (rubyOnPath()) {
      for (const rubyPath of rubyScripts) {
        rubyChecked += 1;
        const result = checkRubySyntax(rubyPath);
        if (!result.success) {
          syntaxFailures.push(result);
        }
      }
    } else {
      console.warn(
        'Automation preflight: skipping Ruby syntax check (ruby not on PATH; workflow YAML parsing still runs in CI).'
      );
    }
  }

  const shellScripts = listShellAutomationScripts();
  let shellChecked = 0;
  if (shellScripts.length > 0) {
    if (bashOnPath()) {
      for (const shPath of shellScripts) {
        shellChecked += 1;
        const result = checkShellSyntax(shPath);
        if (!result.success) {
          syntaxFailures.push(result);
        }
      }
    } else {
      console.warn(
        'Automation preflight: skipping bash -n on scripts/automation/*.sh (bash not on PATH).'
      );
    }
  }

  const ecosystemAudit = loadEcosystem();
  const packageFailures = auditPackageScripts(ecosystemAudit.appNames);
  const shellFailures = auditShellPm2Targets(ecosystemAudit.appNames);
  const packageDuplicateCheck = spawnSync(process.execPath, [packageScriptDuplicatesCheckPath], {
    cwd: rootDir,
    encoding: 'utf8',
  });
  const duplicateFailures = [];
  if (packageDuplicateCheck.status !== 0) {
    duplicateFailures.push({
      type: 'package-script-duplicates',
      message: (packageDuplicateCheck.stderr || packageDuplicateCheck.stdout || '').trim() || 'Duplicate script check failed',
    });
  }
  const issueDedupeViolations = checkWorkflowIssueDedupe();
  const integrityFailures = [...ecosystemAudit.failures, ...packageFailures, ...shellFailures, ...duplicateFailures];

  if (syntaxFailures.length > 0 || integrityFailures.length > 0 || issueDedupeViolations.length > 0) {
    console.error(
      `Automation preflight failed: ${syntaxFailures.length} syntax issue(s), ` +
      `${integrityFailures.length} integrity issue(s), ` +
      `${issueDedupeViolations.length} workflow issue-dedupe violation(s).`
    );

    for (const failure of syntaxFailures) {
      console.error(`\n--- ${failure.script} ---`);
      if (failure.stderr.trim()) {
        console.error(failure.stderr.trim());
      } else if (failure.stdout.trim()) {
        console.error(failure.stdout.trim());
      }
    }

    if (integrityFailures.length > 0) {
      console.error('\nIntegrity audit failures:');
      for (const failure of integrityFailures) {
        printAuditFailure(' -', failure);
      }
    }

    if (issueDedupeViolations.length > 0) {
      console.error('\nUse gh-issue-dedupe-or-create.cjs instead of raw gh issue create:');
      for (const v of issueDedupeViolations) {
        console.error(` - ${v.file}:${v.line} ${v.text}`);
      }
    }

    process.exit(1);
  }

  console.log(
    `Automation preflight passed: ${allScripts.length} script(s) syntax-validated` +
    (rubyChecked ? `, ${rubyChecked} Ruby file(s) checked` : '') +
    (shellChecked ? `, ${shellChecked} shell script(s) checked` : '') +
    `, ${Object.keys(loadJson(packageJsonPath).scripts || {}).length} npm script(s) audited, ` +
    `${ecosystemAudit.appNames.size} PM2 app(s) verified.`
  );
}

main();
