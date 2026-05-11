#!/usr/bin/env node
/**
 * Parallel.v2 Thread Parallelization (Worker)
 * -------------------------------------------
 * Implements a simple worker-pool pattern for CPU-bound tasks
 * using Node.js worker threads. This serves as a prototype for
 * parallel DB joins, image processing, and batch operations.
 */

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');

const WORKER_COUNT = process.env.PARALLEL_WORKERS || Math.min(4, os.cpus().length);

function runWorker(taskFn, data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: { task: taskFn.toString(), data }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

if (!isMainThread) {
  const fn = eval(`(${workerData.task})`);
  Promise.resolve(fn(workerData.data))
    .then(result => parentPort.postMessage({ success: true, result }))
    .catch(err => parentPort.postMessage({ success: false, error: err.message }));
} else {
  // Main thread exports pool execution
  module.exports = {
    executeParallel: async (tasks, fn) => {
      const workers = tasks.map(t => runWorker(fn, t));
      return Promise.all(workers);
    },
    WORKER_COUNT
  };
}