import { EventEmitter } from 'node:events';
import { stat, writeFile, readFile } from 'node:fs/promises';

export class Logger extends EventEmitter {
  constructor(filename, maxSize, init = true) {
    super();
    this.filename = filename;
    this.maxSize = maxSize;
    this.logQueue = [];
    // при добавление сообщения в очередь меняем размер
    // очереди на длинну строки сообщения.
    this.logQueueSize = 0;
    // если размер очерди привышает размер файла меняем флаг.
    this.logQueueOverflow = false;
    this.writing = false;
    init && this.init();
  }

  init() {
    this.on('messageLogged', message => {
      console.log('Message recorded:', message);
    });

    // если файла не он будет создан.
    this.writeLog();
  }

  log(message) {
    const logMessage = `${new Date(Date.now()).toISOString()}: ${message}`;

    while (
      this.logQueue.length &&
      this.logQueueSize + logMessage.length >= this.maxSize
    ) {
      this.logQueueSize -= this.logQueue.pop().length;
      this.logQueueOverflow = true;
    }

    this.logQueue.unshift(logMessage);
    this.logQueueSize += logMessage.length;

    if (!this.writing) this.writeLog();
  }

  async writeLog() {
    try {
      const { logQueue, logQueueOverflow, maxSize, filename } = this;
      let logEntry = logQueue.length ? logQueue.join('\n') : '';

      this.logQueue.length = 0;
      this.logQueueSize = 0;
      this.logQueueOverflow = false;
      this.writing = true;

      if (!logQueueOverflow && logEntry) {
        let appendString = '';
        const fileSize = await this.fileSize;
        const logFile = await readFile(filename, 'utf8');

        if (fileSize + logEntry.length < maxSize) {
          logEntry = `${logEntry}\n${logFile}`;
        } else {
          const logFileLine = logFile.split('\n');

          writeFile(`${this.filename}.bak`, logFile, {
            flag: 'w+',
          });

          while (logEntry.length + appendString.length + 1 < maxSize) {
            appendString = logFileLine.pop();

            if (logEntry.length + appendString.length + 1 < maxSize) {
              logEntry = `${appendString}\n${logEntry}`;
            }
          }
        }
      }

      await writeFile(filename, logEntry, {
        encoding: 'utf8',
        flag: 'w+',
      });

      this.emit(
        'messageLogged',
        `${new Date(Date.now()).toISOString()}: ${
          logEntry ? 'log overwrite' : 'log created'
        } - size: ${logEntry.length}byte;`,
      );

      this.writing = false;

      if (this.logQueue.length) {
        await this.writeLog();
      }
    } catch (err) {
      this.log(err.message);
    }
  }

  get fileSize() {
    return stat(this.filename)
      .then(stat => stat.size)
      .catch(() => 0);
  }
}
