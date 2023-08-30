import { readdir, rm } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import chalk from 'chalk';
import path from 'node:path';

export const getTextFileNames = async dirPath => {
  const files = (
    await readdir(dirPath, { withFileTypes: true }).catch(() => {
      console.log(chalk.red('Error: Данная дирректория недоступна...'));

      return null;
    })
  ).reduce((textFiles, file) => {
    if (!file.isDirectory() && path.extname(file.name) === '.txt') {
      textFiles.push(dirPath + path.sep + file.name);
    }

    return textFiles;
  }, []);

  if (!files.length) {
    console.log(
      chalk.yellow('Warn: В данной директории не найдены текстовые файлы...'),
    );

    return null;
  }

  return files;
};

export const replaceText = async (fileName, find, replace) => {
  let count = 0;

  await pipeline(
    createReadStream(fileName),
    async function* (source) {
      source.setEncoding('utf8');

      for await (const chunk of source) {
        const withoutFound = chunk.split(find);

        count += withoutFound.length - 1;

        yield withoutFound.join(replace);
      }
    },
    createWriteStream(fileName + 'temp'),
  );

  await pipeline(
    createReadStream(fileName + 'temp'),
    createWriteStream(fileName),
  );

  await rm(fileName + 'temp');

  console.log(
    chalk.cyan(
      `В файле ${path.basename(fileName)} найдено и заменено слов: ` +
        chalk.green(count),
    ),
  );
};

export const replaceTextAll = async (files, find, replace) =>
  await Promise.all(
    files.reduce((promises, fileName) => {
      promises.push(replaceText(fileName, find, replace));

      return promises;
    }, []),
  );
