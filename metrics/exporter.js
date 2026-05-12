// metrics/exporter.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const { register, Gauge } = require('prom-client');

const METRICS_FILE = process.env.METRICS_FILE || path.join(__dirname, '..', 'scripts', 'performance.json');

const cpuGauge = new Gauge({ name: 'app_cpu_percent', help: 'CPU usage percent' });
const memGauge = new Gauge({ name: 'app_memory_used_mb', help: 'Memory used in MiB' });
const memPctGauge = new Gauge({ name: 'app_memory_percent', help: 'Memory usage percent' });
const errorCounter = new Gauge({ name: 'app_recent_errors', help: 'Number of errors in last 5 min' });

function collectMetrics() {
  try {
    const data = JSON.parse(fs.readFileSync(METRICS_FILE, 'utf8'));
    cpuGauge.set(data.cpu_percent);
    memGauge.set(data.memory_used_mb);
    memPctGauge.set(data.memory_percent);
    errorCounter.set(data.recent_errors);
  } catch (e) {
    console.error('Error reading performance metrics:', e.message);
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    collectMetrics();
    res.setHeader('Content-Type', register.contentType);
    res.end(register.metrics());
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const port = parseInt(process.env.EXPORTER_PORT || '9100', 10);
server.listen(port, () => {
  console.log(`Prometheus exporter listening on port ${port}`);
});