import { copyFolder } from './modules/copyFolder.js';
import { Logger } from './modules/Logger.js';

const appCopyFiles = async (sourceDir, targetDir) => {
  try {
    await copyFolder(sourceDir, targetDir);
  } catch (err) {
    console.warn(`Ошибка приложения: ${err.message}`);
  }
};

const appLogger = async () => {
  const logger = new Logger('./files/log-v1.txt', 1024);

  for (let j = 0; j < 10; j++) {
    setTimeout(async () => {
      console.log(`Пакет - ${j + 1}`);
      for (let i = 0; i < 100000; i++) {
        logger.log(`Сообщение №${i + 100000 * j}`);
        if (i + 100000 * j === 234231) {
          throw new Error('Пришол полный пицец!!!!');
        }
      }
    }, 20000 * j);
  }
};

// если не сделать паузу в 20 секунд между пакетами то ничего не запишется
// оно и понятно объем данных больше 4Мб, алгоритм медленный,
// алгоритм с фильтрацией и переполнением на очереди куда быстрее.

console.log('App start');
appCopyFiles('./files/test', './files/newFolder');
appLogger();
