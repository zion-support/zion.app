#!/usr/bin/env node
/**
 * CRITICAL PATCH: Graceful OpenRouter API Handling
 *
 * This patch wraps openclaw-agent processes to detect missing/invalid OpenRouter
 * credentials and skip AI operations gracefully instead of crashing.
 *
 * INSTALLATION: Prepend to any autonomous agent script that uses openclaw agent
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const AUTH_ERROR_PATTERNS = [
  /openrouter.*api key/i,
  /authentication failed/i,
  /missing.*credential/i,
  /no.*api[_-]?key/i,
  /401.*unauthorized/i,
  /config.*auth/i,
];

const MAX_CONSECUTIVE_AUTH_FAILURES = 3;

// State tracking
let authFailureCount = 0;
let lastAuthError = null;

function isAuthError(errorOutput) {
  if (!errorOutput) return false;
  const lower = errorOutput.toLowerCase();
  return AUTH_ERROR_PATTERNS.some((pattern) => pattern.test(lower));
}

function shouldSkipCycle() {
  return authFailureCount >= MAX_CONSECUTIVE_AUTH_FAILURES;
}

function resetAuthFailure() {
  authFailureCount = 0;
  lastAuthError = null;
}

function wrapAgentCommand(agentName, command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    if (shouldSkipCycle()) {
      console.log(`[AuthHandler] Skipping ${agentName} due to repeated auth failures`);
      resolve({ skipped: true, reason: 'auth_failure_backoff' });
      return;
    }

    const child = spawn(command, args, {
      ...opts,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timeoutMs = (opts.timeoutSeconds || 60) * 1000;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, timeoutMs);

    child.stdout.on('data', (data) => (stdout += data.toString()));
    child.stderr.on('data', (data) => (stderr += data.toString()));

    child.on('close', (code) => {
      clearTimeout(timer);

      if (isAuthError(stderr)) {
        authFailureCount++;
        lastAuthError = stderr;
        console.log(`[AuthHandler] Detected auth failure for ${agentName} (count: ${authFailureCount})`);
        console.log(`[AuthHandler] Error: ${stderr.substring(0, 200)}`);

        if (authFailureCount >= MAX_CONSECUTIVE_AUTH_FAILURES) {
          console.log(`[AuthHandler] Hit failure threshold - disabling AI operations for ${agentName} temporarily`);
        }

        // Return a mock success with a warning to keep the agent alive
        resolve({
          skipped: true,
          reason: 'auth_failure',
          warning: 'OpenRouter credentials missing/invalid. AI operations disabled.',
          authCount: authFailureCount,
        });
        return;
      }

      // Not an auth error - reset counter
      resetAuthFailure();

      if (code === 0) {
        resolve({ stdout, stderr, code, authSkipped: false });
      } else {
        reject({ stdout, stderr, code, error: new Error('Command failed') });
      }
    });

    child.on('error', (err) => reject(err));
  });
}

module.exports = {
  wrapAgentCommand,
  isAuthError,
  shouldSkipCycle,
  resetAuthFailure,
  authFailureCount: () => authFailureCount,
  lastAuthError: () => lastAuthError,
};

// Self-test when run directly
if (require.main === module) {
  console.log('[AuthHandler] Self-test: wrapped module loaded successfully');
}
