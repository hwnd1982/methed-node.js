import { copyFolder } from './modules/copyFolder.js';
import { Logger } from './modules/Logger._v1.js';

const appCopyFiles = async (sourceDir, targetDir) => {
  try {
    await copyFolder(sourceDir, targetDir);
  } catch (err) {
    console.warn(`Ошибка приложения: ${err.message}`);
  }
};

const appLogger = async () => {
  const logger = new Logger('./files/log-v1.txt', 1024);

  for (let i = 0; i < 100; i++) {
    logger.log(`Сообщение №${i}`);
  }
};

console.log('App start');
appCopyFiles('./files/test', './files/newFolder');
appLogger();
