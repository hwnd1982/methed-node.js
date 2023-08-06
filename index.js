import { watch } from 'node:fs/promises';
import { copyFolde } from './modules/copyFolder.js';
import { Logger } from './modules/Logger.js';
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

const logger = new Logger('./files/watcherlog.txt', 2048);

const watcherStart = async path => {
  try {
    let date = 0;
    const watcher = watch(path, { recursive: true });

    for await (const { eventType, filename } of watcher) {
      const now = Date.now();

      if (now - date > 100) {
        date = now;
        logger.log(`${eventType} - ${filename}`);
      }
    }
  } catch (err) {
    console.log(`Ошибка приложения: ${err.message}`);
  }
};

const appCopyFiles = async () => {
  try {
    await copyFolde('./files/test', './files/newFolder');
  } catch (err) {
    console.warn(`Ошибка приложения: ${err.message}`);
  }
};

watcherStart('./files');
app();
appCopyFiles();

console.log('App start');
