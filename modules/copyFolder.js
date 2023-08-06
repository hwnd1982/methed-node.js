import { copyFile, readdir, access, mkdir } from 'node:fs/promises';
import { Logger } from './Logger.js';

const logger = new Logger('./files/log.txt', 1024);

logger.fileSize.then(stat => console.log(stat.size));

export const copyFolde = async (
  sourceDir,
  targetDir,
  callback = (err = null) =>
    err && logger.log(`Ошибка копирования папки: ${err.message}`),
) => {
  try {
    const { files, dirs } = (
      await readdir(sourceDir, { withFileTypes: true })
    ).reduce(
      ({ files, dirs }, file) => {
        file.isDirectory() ? dirs.push(file.name) : files.push(file.name);

        return { files, dirs };
      },
      { files: [], dirs: [] },
    );

    await access(targetDir).catch(async () => {
      await mkdir(targetDir);
      logger.log('Папка создана');
    });

    files.forEach(async file => {
      await copyFile(`${sourceDir}/${file}`, `${targetDir}/${file}`);
      logger.log(`${file} скопирован`);
    });

    dirs.forEach(async dir => {
      await copyFolde(`${sourceDir}/${dir}`, `${targetDir}/${dir}`, callback);
    });
  } catch (err) {
    callback(err);
  }
};
