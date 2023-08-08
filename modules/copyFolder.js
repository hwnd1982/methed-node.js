import { copyFile, readdir, access, mkdir } from 'node:fs/promises';

export const copyFolder = async (
  sourceDir,
  targetDir,
  callback = (err = null) =>
    console.log(
      err ? `Folder copy error: ${err.message}` : 'Copying is prohibited.',
    ),
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
      console.log('folder created');
    });

    files.forEach(async file => {
      await copyFile(`${sourceDir}/${file}`, `${targetDir}/${file}`);
      console.log(`${file} copied`);
    });

    dirs.forEach(async dir => {
      await copyFolder(`${sourceDir}/${dir}`, `${targetDir}/${dir}`, callback);
    });
  } catch (err) {
    callback(err);
  }
};
