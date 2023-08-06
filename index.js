import {
  readdir,
  rename,
  mkdir,
  copyFile,
  access,
  watch,
} from 'node:fs/promises';
import { copyFolde } from './modules/copyFolder.js';
import { readText } from './modules/readText.js';
import { write } from './modules/write.js';

const app = async () => {
  try {
    const text = await readText('./files/text.txt');

    console.log('text', text);

    await write('./files/reultAsync.txt', text.toUpperCase());

    console.log('Done');
  } catch (err) {
    console.warn(`Ошибка приложения: ${err.message}`);
  }
};

const watcherStart = async path => {
  try {
    let date = 0;
    const changes = [];
    const watcher = watch(path);

    for await (const { eventType, filename } of watcher) {
      const now = Date.now();

      if (now - date > 100) {
        date = now;
        changes.push({ date, eventType, filename });

        // console.log('\x1Bc');
        changes.forEach(({ date, eventType, filename }) => {
          console.log(
            `${new Date(date).toISOString()}: ${eventType} - ${filename}`,
          );
        });
      }
    }
  } catch (err) {
    console.log(`Ошибка приложения: ${err.message}`);
  }
};

const appCopyFiles = async () => {
  try {
    const files = await readdir('./files');

    if (
      !(await access('./files/newFolder').catch(async () => {
        await mkdir('./files/newFolder');
        console.log('Папка создана');
      }))
    ) {
      files.splice(files.indexOf('newFolder'), 1);
    }

    files.forEach(async file => {
      await copyFile(`./files/${file}`, `./files/newFolder/${file}`);

      console.log(file, 'скопирован');
    });
  } catch (err) {
    console.warn(`Ошибка приложения: ${err.message}`);
  }
};

// watcherStart('./files');
// app();
// appCopyFiles();
copyFolde('./files/test', './files/newFolder');
console.log('App start');
