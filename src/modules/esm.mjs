import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { release, version } from 'os';
import { createServer as createServerHttp } from 'http';
import './files/c.cjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const random = Math.random();

let unknownObject;

const aPath = path.join(__dirname, 'files', 'a.json');
const bPath = path.join(__dirname, 'files', 'b.json');

const loadJson = async (pathToJson) => {
  const content = await readFile(pathToJson, 'utf-8');
  return JSON.parse(content);
};

if (random > 0.5) {
  unknownObject = await loadJson(aPath);
} else {
  unknownObject = await loadJson(bPath);
}

console.log(`Release ${release()}`);
console.log(`Version ${version()}`);
console.log(`Path segment separator is "${path.sep}"`);
console.log(`Path to current file is ${import.meta.url}`);
console.log(`Path to current directory is ${new URL('.', import.meta.url).pathname}`);

const myServer = createServerHttp((_, res) => {
  res.end('Request accepted');
});

const PORT = 3000;

console.log(unknownObject);

myServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  console.log('To terminate it, use Ctrl+C combination');
});

export { unknownObject, myServer };