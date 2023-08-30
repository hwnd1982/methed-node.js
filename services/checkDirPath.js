import { opendir, mkdir } from 'node:fs/promises';
import path from 'node:path';

export const checkDirPath = async dirPath => {
  try {
    await opendir(dirPath);
  } catch {
    await checkDirPath(path.dirname(dirPath));
    await mkdir(dirPath);
  }
};
