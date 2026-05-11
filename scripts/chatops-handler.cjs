#!/usr/bin/env node
/**
 * ChatOps Command Handler
 * Processes slash commands in issues and PRs.
 */
const { execSync } = require('child_process');

const commands = {
  '/oc status': () => {
    execSync('gh workflow list', { stdio: 'inherit' });
  },
  '/oc run': (args) => {
    console.log(`Running: ${args}`);
    execSync(`gh workflow run ai-automation-engine.yml -f message="${args}"`, { stdio: 'inherit' });
  },
  '/oc health': () => {
    const score = execSync('node ai_automation_engine.py 2>&1 | grep "Score"').toString();
    console.log(`System Health: ${score}`);
  }
};

function handleChatOps() {
  const body = process.env.CHATOPS_BODY || '';
  const lines = body.split('\n');
  
  lines.forEach(line => {
    const cmd = line.trim();
    if (cmd.startsWith('/oc')) {
      const [command, ...args] = cmd.split(' ');
      const handler = commands[command];
      if (handler) {
        console.log(`Executing: ${command}`);
        handler(args.join(' '));
      }
    }
  });
}

handleChatOps();