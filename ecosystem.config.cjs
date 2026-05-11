module.exports = {
  apps: [
    {
      name: "ai-predictive-monitor",
      script: "./app/ai-predictive-maintenance/page.tsx",
      interpreter: "node",
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
        PM2_SILENT: true
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_overload_restart: 10,
      min_uptime: "10s",
      max_restarts: 10
    },
    {
      name: "ai-compliance-guard",
      script: "./app/ai-compliance-monitor/page.tsx",
      interpreter: "node",
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "development",
        PORT: 3002,
        PM2_SILENT: true
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_overload_restart: 5,
      min_uptime: "5s",
      max_restarts: 5
    },
    {
      name: "ai-memory-watcher",
      script: "./app/ai-memory-wiki/page.tsx",
      interpreter: "node",
      max_memory_restart: "768M",
      env: {
        NODE_ENV: "development",
        PORT: 3003,
        PM2_SILENT: true
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_overload_restart: 3,
      min_uptime: "3s",
      max_restarts: 3
    }
  ]
};
