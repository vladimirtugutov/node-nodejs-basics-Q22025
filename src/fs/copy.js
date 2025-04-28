import { mkdir, copyFile, readdir, stat, access } from 'fs/promises';
import { constants } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const copy = async () => {
  const srcFolder = join(__dirname, 'files');
  const destFolder = join(__dirname, 'files_copy');

  try {
    await access(srcFolder, constants.F_OK);

    try {
      await access(destFolder, constants.F_OK);
      throw new Error('FS operation failed');
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw new Error('FS operation failed');
      }
    }

    await mkdir(destFolder);

    const items = await readdir(srcFolder, { withFileTypes: true });

    for (const item of items) {
      if (item.isFile()) {
        const srcPath = join(srcFolder, item.name);
        const destPath = join(destFolder, item.name);
        await copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    throw new Error('FS operation failed');
  }
};

await copy();