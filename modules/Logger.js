import { EventEmitter } from 'node:events';
import { stat, appendFile, access, writeFile } from 'node:fs/promises';
import { write } from './write.js';
import { readText } from './readText.js';

export class Logger extends EventEmitter {
  constructor(filename, maxSize, init = true) {
    super();
    this.filename = filename;
    this.maxSize = maxSize;
    this.logQueue = [];
    this.logQueueSize = 0;
    this.logQueueOverflow = false;
    this.writing = false;
    this.promise = null;
    init && this.init();
  }

  init() {
    this.promise = access(this.filename).catch(async () => {
      this.promise = write(this.filename, '');
      this.log('log file created');
    });

    this.on('messageLogged', message => {
      console.log('Message recorded:', message);
    });
  }

  log(message) {
    message = `${new Date(Date.now()).toISOString()}: ${message}`;

    if (this.logQueueSize + message.length + 1 > this.maxSize) {
      const log = `${new Date(Date.now()).toISOString()}: log file overwritten`;

      this.logQueueOverflow = true;

      while (this.logQueueSize + message.length + 2 > this.maxSize) {
        this.logQueueSize -= this.logQueue.shift().length;
      }

      this.logQueue.unshift(log);
      this.logQueueSize += log.length;
    }

    this.logQueue.push(message);
    this.logQueueSize += message.length;

    if (!this.writing) this.writeLog();
  }

  async writeLog() {
    const logQueue = [...this.logQueue];
    const { logQueueOverflow, logQueueSize, maxSize, filename } = this;

    this.logQueue = [];
    this.logQueueSize = 0;
    this.logQueueOverflow = false;

    this.writing = true;
    if (logQueueOverflow) {
      await writeFile(filename, `${logQueue.join('\n')}`, {
        encoding: 'utf8',
      });
    }

    if (!logQueueOverflow) {
      const size = (await this.fileSize).size;

      if (size + logQueueSize > maxSize) {
        let fileSize = logQueueSize;
        const log = `${new Date(
          Date.now(),
        ).toISOString()}: log file overwritten`;
        const text = (await readText(filename)).split('\n');

        logQueue.shift();
        for (let i = text.length - 1; fileSize < maxSize && i > 0; i--) {
          fileSize += text[i].length + 1;

          if (fileSize < maxSize) {
            logQueue.unshift(text[i]);
          }
        }

        logQueue.unshift(log);
        await writeFile(filename, `${logQueue.join('\n')}`, {
          encoding: 'utf8',
        });
      } else {
        await appendFile(
          filename,
          `${size ? '\n' : ''}${logQueue.join('\n')}`,
          {
            encoding: 'utf8',
          },
        );
      }
    }

    logQueue.forEach(log => this.emit('messageLogged', log));
    this.writing = false;
  }

  rotateLog() {}

  get fileSize() {
    if (this.promise) {
      return this.promise.then(() => stat(this.filename));
    } else {
      return stat(this.filename);
    }
  }
}
