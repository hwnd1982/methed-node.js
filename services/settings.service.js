import { mkdir, opendir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
// os
// console.log(os.arch());
// console.log(os.platform());
// console.log(os.type());
// console.log(os.version());
// console.log(os.release());
// console.log();
// console.log(os.totalmem());
// console.log(os.freemem());
// console.log(os.uptime());
// console.log();
// console.log(os.userInfo());
// console.log(os.tmpdir());
// console.log(os.homedir());

const filePath = path.join(os.homedir(), 'genpass', 'settings.json');

// path
// console.log(path.sep);
// console.log(path.basename(filePath));
// console.log(path.dirname(filePath));
// console.log(path.extname(filePath));

export const checkDirPath = async dirPath => {
  try {
    await opendir(dirPath);
  } catch {
    await checkDirPath(path.dirname(dirPath));
    await mkdir(dirPath);
  }
};

export const saveSettings = async option => {
  await checkDirPath(path.dirname(filePath));
  await writeFile(filePath, JSON.stringify(option), 'utf-8');
};

export const getSettings = async () => {
  try {
    return JSON.parse(await readFile(filePath, 'utf-8')) || null;
  } catch {
    return null;
  }
};
