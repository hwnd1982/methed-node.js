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
        logEntry += `\n${await readFile(filename)}`;

        // использую writeFile, а не copyFile, чтобы не тормозить процесс,
        // не использую await так как процесс записи будет параллельным
        logEntry.length >= maxSize && this.rotateLog(logEntry);
        while (logEntry.length >= maxSize) {
          logEntry = logEntry.slice(0, logEntry.lastIndexOf('\n'));
        }
      }

      await writeFile(filename, logEntry);

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

  async rotateLog(log) {
    await writeFile(`${this.filename}.bak`, log);
    this.emit(
      'messageLogged',
      `${new Date(Date.now()).toISOString()}: log rotated to ${
        this.filename
      }.bak`,
    );
  }

  // лишний метод не используется
  get fileSize() {
    return stat(this.filename)
      .then(stat => stat.size)
      .catch(() => 0);
  }
}
