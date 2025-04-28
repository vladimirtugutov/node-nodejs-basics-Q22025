import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const spawnChildProcess = async (args) => {
  const scriptPath = join(__dirname, 'files', 'script.js');

  const child = spawn('node', [scriptPath, ...args], {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
  });

  await new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
};

spawnChildProcess(['arg1', 'arg2']);