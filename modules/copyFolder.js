import { copyFile, readdir, access, mkdir } from 'node:fs/promises';

export const copyFolde = async (
  sourceDir,
  targetDir,
  callback = (err = null) =>
    err && console.log(`Ошибка копирования папки: ${err.message}`),
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
      console.log('Папка создана');
    });

    files.forEach(async file => {
      await copyFile(`${sourceDir}/${file}`, `${targetDir}/${file}`);
      console.log(file, 'скопирован');
    });

    dirs.forEach(async dir => {
      await copyFolde(`${sourceDir}/${dir}`, `${targetDir}/${dir}`, callback);
    });
  } catch (err) {
    callback(err);
  }
};
