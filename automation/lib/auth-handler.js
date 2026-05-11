/**
 * OpenClaw Agent Auth Handler
 * Provides graceful degradation when OpenRouter credentials are missing
 */

const { spawn } = require('child_process');

const AUTH_ERROR_PATTERNS = [
  /openrouter.*api key/i,
  /authentication failed/i,
  /missing.*credential/i,
  /no.*api[_-]?key/i,
  /401.*unauthorized/i,
  /config.*auth/i,
  /rate exceed/i,
  /insufficient quota/i
];

const MAX_FAILURES = 3;
const STATE_FILE = '/tmp/openclaw-auth-failures.json';

let state = {};
try {
  if (require('fs').existsSync(STATE_FILE)) {
    state = JSON.parse(require('fs').readFileSync(STATE_FILE, 'utf8'));
  }
} catch (e) {
  // Ignore
}

function saveState() {
  try {
    require('fs').writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (e) {
    // Ignore write errors
  }
}

function isAuthError(stderr) {
  if (!stderr) return false;
  return AUTH_ERROR_PATTERNS.some(p => p.test(stderr));
}

function shouldSkip(agentName) {
  const key = `failures:${agentName}`;
  return state[key] && state[key] >= MAX_FAILURES;
}

function recordSuccess(agentName) {
  const key = `failures:${agentName}`;
  if (state[key]) {
    delete state[key];
    saveState();
  }
}

function recordFailure(agentName, error) {
  const key = `failures:${agentName}`;
  state[key] = (state[key] || 0) + 1;
  state[`lastError:${agentName}`] = error.substring(0, 500);
  saveState();
}

async function runAgentSafely(agentName, message, options = {}) {
  if (shouldSkip(agentName)) {
    console.log(`[AuthHandler] ${agentName} disabled due to repeated auth failures`);
    return { skipped: true, reason: 'auth_backoff', authCount: state[`failures:${agentName}`] };
  }

  return new Promise((resolve, reject) => {
    const args = [
      'agent',
      '--agent', 'main',
      '--message', message,
      '--thinking', options.thinking || 'low',
      '--timeout', (options.timeoutSeconds || 90).toString(),
      '--json'
    ];

    const child = spawn('openclaw', args, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';

    const timeoutMs = (options.timeoutSeconds || 90) * 1000 + 10000;
    const timer = setTimeout(() => {
      child.kill('SIGTERM');
    }, timeoutMs);

    child.stdout.on('data', (data) => stdout += data);
    child.stderr.on('data', (data) => stderr += data);

    child.on('close', (code) => {
      clearTimeout(timer);
      const stderrStr = stderr.toString();

      if (isAuthError(stderrStr)) {
        recordFailure(agentName, stderrStr);
        const failCount = state[`failures:${agentName}`];
        console.log(`[AuthHandler] ${agentName} auth failure (count: ${failCount})`);

        if (failCount >= MAX_FAILURES) {
          console.log(`[AuthHandler] ${agentName} hitting threshold - AI operations disabled`);
        }

        resolve({ authFailed: true, skipped: true, authCount: failCount });
        return;
      }

      recordSuccess(agentName);

      if (code !== 0) {
        reject(new Error(`Agent exit code ${code}: ${stderrStr.substring(0, 200)}`));
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

module.exports = {
  runAgentSafely,
  isAuthError,
  shouldSkip,
  recordSuccess,
  recordFailure,
  getState: () => ({ ...state })
};
