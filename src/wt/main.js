import { Worker } from 'worker_threads';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { cpus } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const performCalculations = async () => {
  const workerPath = join(__dirname, 'worker.js');
  const numCores = cpus().length;

  const promises = [];

  for (let i = 0; i < numCores; i++) {
    const workerData = 10 + i;

    const promise = new Promise((resolve) => {
      const worker = new Worker(workerPath);

      worker.on('online', () => {
        worker.postMessage(workerData);
      });

      worker.on('message', (data) => {
        resolve({ status: 'resolved', data });
      });

      worker.on('error', () => {
        resolve({ status: 'error', data: null });
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          resolve({ status: 'error', data: null });
        }
      });
    });

    promises.push(promise);
  }

  const results = await Promise.all(promises);
  console.log(results);
};

await performCalculations();