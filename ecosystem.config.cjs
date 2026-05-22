module.exports = {
  apps: [
    {
      name: 'continuous-improvement-loop',
      script: 'openclaw-agents/12-continuous-loop.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'master-orchestrator',
      script: 'openclaw-agents/master-orchestrator.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'code-auditor',
      script: 'openclaw-agents/01-code-auditor.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'bug-hunter',
      script: 'openclaw-agents/02-bug-hunter.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'performance-optimizer',
      script: 'openclaw-agents/03-performance-optimizer.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'content-enhancer',
      script: 'openclaw-agents/04-content-enhancer.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'ideas-generator',
      script: 'openclaw-agents/05-ideas-generator.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'issue-triage',
      script: 'openclaw-agents/06-issue-auto-triage.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'ci-healer',
      script: 'openclaw-agents/07-self-heal-ci.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'pm2-manager',
      script: 'openclaw-agents/08-pm2-manager.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'more-ideas',
      script: 'openclaw-agents/09-more-ideas.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'task-generator',
      script: 'openclaw-agents/10-task-generator.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'task-executor',
      script: 'openclaw-agents/11-task-executor.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'code-review',
      script: 'openclaw-agents/13-code-review.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'docs-generator',
      script: 'openclaw-agents/14-docs-generator.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'testing-agent',
      script: 'openclaw-agents/15-testing-agent.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'deployment-agent',
      script: 'openclaw-agents/16-deployment-agent.cjs',
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }

    {
      name: 'ai-content-organizer',
      script: 'missing-pm2-stubs/ai-content-organizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-frontend-advertiser',
      script: 'missing-pm2-stubs/ai-frontend-advertiser.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-continuous-improvement',
      script: 'missing-pm2-stubs/ai-continuous-improvement.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-build-fixer',
      script: 'missing-pm2-stubs/ai-build-fixer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-smart-dependency-manager',
      script: 'missing-pm2-stubs/ai-smart-dependency-manager.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-restart-guardian',
      script: 'missing-pm2-stubs/ai-pm2-restart-guardian.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-config-drift-guard',
      script: 'missing-pm2-stubs/ai-pm2-config-drift-guard.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-slo-agent',
      script: 'missing-pm2-stubs/ai-pm2-slo-agent.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-slo-escalation-agent',
      script: 'missing-pm2-stubs/ai-pm2-slo-escalation-agent.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-priority-throttler',
      script: 'missing-pm2-stubs/ai-pm2-priority-throttler.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-deploy-hook-availability-guard',
      script: 'missing-pm2-stubs/ai-deploy-hook-availability-guard.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-netlify-hook-smoke-agent',
      script: 'missing-pm2-stubs/ai-netlify-hook-smoke-agent.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-test-automation',
      script: 'missing-pm2-stubs/ai-test-automation.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-security-scanner',
      script: 'missing-pm2-stubs/ai-security-scanner.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-git-workflow',
      script: 'missing-pm2-stubs/ai-git-workflow.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-documentation-generator',
      script: 'missing-pm2-stubs/ai-documentation-generator.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-bundle-optimizer',
      script: 'missing-pm2-stubs/ai-bundle-optimizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-image-optimizer',
      script: 'missing-pm2-stubs/ai-image-optimizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-route-optimizer',
      script: 'missing-pm2-stubs/ai-route-optimizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-complexity-analyzer',
      script: 'missing-pm2-stubs/ai-complexity-analyzer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-performance-optimizer',
      script: 'missing-pm2-stubs/ai-performance-optimizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-layout-design-automation',
      script: 'missing-pm2-stubs/ai-layout-design-automation.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-broken-link-fixer',
      script: 'missing-pm2-stubs/ai-broken-link-fixer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'openclaw-autonomous-prompts',
      script: 'missing-pm2-stubs/openclaw-autonomous-prompts.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'openclaw-autonomous-guardian',
      script: 'missing-pm2-stubs/openclaw-autonomous-guardian.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' 
    },
    {
      name: 'ai-content-organizer',
      script: 'missing-pm2-stubs/ai-content-organizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-frontend-advertiser',
      script: 'missing-pm2-stubs/ai-frontend-advertiser.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-continuous-improvement',
      script: 'missing-pm2-stubs/ai-continuous-improvement.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-build-fixer',
      script: 'missing-pm2-stubs/ai-build-fixer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-smart-dependency-manager',
      script: 'missing-pm2-stubs/ai-smart-dependency-manager.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-restart-guardian',
      script: 'missing-pm2-stubs/ai-pm2-restart-guardian.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-config-drift-guard',
      script: 'missing-pm2-stubs/ai-pm2-config-drift-guard.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-slo-agent',
      script: 'missing-pm2-stubs/ai-pm2-slo-agent.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-slo-escalation-agent',
      script: 'missing-pm2-stubs/ai-pm2-slo-escalation-agent.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-pm2-priority-throttler',
      script: 'missing-pm2-stubs/ai-pm2-priority-throttler.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-deploy-hook-availability-guard',
      script: 'missing-pm2-stubs/ai-deploy-hook-availability-guard.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-netlify-hook-smoke-agent',
      script: 'missing-pm2-stubs/ai-netlify-hook-smoke-agent.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-test-automation',
      script: 'missing-pm2-stubs/ai-test-automation.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-security-scanner',
      script: 'missing-pm2-stubs/ai-security-scanner.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-git-workflow',
      script: 'missing-pm2-stubs/ai-git-workflow.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-documentation-generator',
      script: 'missing-pm2-stubs/ai-documentation-generator.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-bundle-optimizer',
      script: 'missing-pm2-stubs/ai-bundle-optimizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-image-optimizer',
      script: 'missing-pm2-stubs/ai-image-optimizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-route-optimizer',
      script: 'missing-pm2-stubs/ai-route-optimizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-complexity-analyzer',
      script: 'missing-pm2-stubs/ai-complexity-analyzer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-performance-optimizer',
      script: 'missing-pm2-stubs/ai-performance-optimizer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-layout-design-automation',
      script: 'missing-pm2-stubs/ai-layout-design-automation.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'ai-broken-link-fixer',
      script: 'missing-pm2-stubs/ai-broken-link-fixer.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'openclaw-autonomous-prompts',
      script: 'missing-pm2-stubs/openclaw-autonomous-prompts.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },
    {
      name: 'openclaw-autonomous-guardian',
      script: 'missing-pm2-stubs/openclaw-autonomous-guardian.cjs',
      instances: 1, autorestart: true, max_memory_restart: '512M',
      env: { NODE_ENV: 'production' }
    },

  ]
};,
