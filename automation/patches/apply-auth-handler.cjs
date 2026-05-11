#!/usr/bin/env node
/**
 * Autonomous Agent Auth Handler Patcher
 *
 * Patches all openclaw-autonomous-* agents to gracefully handle
 * missing OpenRouter credentials and prevent restart loops.
 *
 * Usage: node apply-auth-handler.js
 */

const fs = require('fs');
const path = require('path');

const AUTH_HANDLER_CODE = `
// === AUTH HANDLER PATCH START ===
const { spawn } = require('child_process');
const CREDENTIAL_ERROR_PATTERNS = [
  /openrouter.*api key/i,
  /authentication failed/i,
  /missing.*credential/i,
  /no.*api[_-]?key/i,
  /401.*unauthorized/i,
  /config.*auth/i,
];

let authConsecutiveFails = 0;
const AUTH_FAIL_THRESHOLD = 3;

function wrapOpenClawAgent(agentName, message, thinking = 'low', timeoutSeconds = 90) {
  if (authConsecutiveFails >= AUTH_FAIL_THRESHOLD) {
    console.log('[' + agentName + '] Skipping due to repeated auth failures');
    return { skipped: true, reason: 'auth_backoff' };
  }

  return new Promise((resolve, reject) => {
    const cmd = 'openclaw';
    const args = ['agent', '--agent', 'main', '--message', message, '--thinking', thinking, '--timeout', timeoutSeconds.toString(), '--json'];

    const child = spawn(cmd, args, { shell: true, stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    const timeoutMs = timeoutSeconds * 1000 + 10000;
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
    }, timeoutMs);

    child.stdout.on('data', (data) => stdout += data);
    child.stderr.on('data', (data) => stderr += data);

    child.on('close', (code) => {
      clearTimeout(timer);

      const stderrStr = stderr.toString();
      const isAuthError = CREDENTIAL_ERROR_PATTERNS.some(p => p.test(stderrStr));

      if (isAuthError) {
        authConsecutiveFails++;
        console.log('[' + agentName + '] Auth failure detected (count: ' + authConsecutiveFails + ')');

        if (authConsecutiveFails >= AUTH_FAIL_THRESHOLD) {
          console.log('[' + agentName + '] Auth failure threshold reached - disabling AI operations');
        }

        // Return valid but empty result to keep agent alive
        resolve({ authFailed: true, skipped: true, authCount: authConsecutiveFails });
        return;
      }

      // Reset counter on success or non-auth error
      authConsecutiveFails = 0;

      if (code !== 0) {
        reject(new Error('Agent exited with code ' + code + ': ' + stderrStr.substring(0, 200)));
        return;
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        resolve({ raw: stdout, authFailed: false });
      }
    });

    child.on('error', (err) => reject(err));
  });
}

// Monkey-patch executeAgent if it exists
if (typeof executeAgent === 'function') {
  const originalExecuteAgent = executeAgent;
  executeAgent = async function(agentName, message, opts = {}) {
    return wrapOpenClawAgent(agentName, message, opts.thinking, opts.timeoutSeconds);
  };
}
// === AUTH HANDLER PATCH END ===
`;

function patchFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  if (content.includes('AUTH HANDLER PATCH')) {
    console.log('[PATCH] Already patched: ' + path.basename(filePath));
    return false;
  }

  // Find the executeAgent function or the line where openclaw agent is called
  const modified = content.replace(
    /(const\s+executeAgent\s*=\s*async\s*\([^)]*\)\s*=>\s*{)/,
    AUTH_HANDLER_CODE + '\n$1'
  );

  if (modified === content) {
    // Try alternative pattern
    const altModified = content.replace(
      /(async\s+function\s+executeAgent\s*\([^)]*\)\s*{)/,
      AUTH_HANDLER_CODE + '\n$1'
    );
    if (altModified === content) {
      console.log('[PATCH] Could not find injection point: ' + path.basename(filePath));
      return false;
    }
    fs.writeFileSync(filePath, altModified, 'utf8');
  } else {
    fs.writeFileSync(filePath, modified, 'utf8');
  }

  console.log('[PATCH] Successfully patched: ' + path.basename(filePath));
  return true;
}

// Find all autonomous agent files
const automationDir = path.join(process.cwd(), 'automation');
const files = fs.readdirSync(automationDir)
  .filter(f => f.endsWith('.cjs') || f.endsWith('.js'))
  .filter(f => f.includes('autonomous') || f.includes('agent'));

console.log('[PATCH] Found ' + files.length + ' agent files to patch');

let patched = 0;
for (const file of files) {
  if (file.includes('patcher') || file.includes('auth-handler')) continue;
  try {
    if (patchFile(path.join(automationDir, file))) {
      patched++;
    }
  } catch (err) {
    console.log('[PATCH] Error patching ' + file + ': ' + err.message);
  }
}

console.log('[PATCH] Patched ' + patched + ' files');
