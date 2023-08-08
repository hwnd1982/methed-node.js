import { EventEmitter } from 'node:events';
import { stat, writeFile, copyFile } from 'node:fs/promises';

export class Logger extends EventEmitter {
  constructor(filename, maxSize, init = true) {
    super();
    this.filename = filename;
    this.maxSize = maxSize;
    this.logQueue = [];
    this.writing = false;
    init && this.init();
  }

  init() {
    this.on('messageLogged', message => {
      console.log('Message recorded:', message);
    });
  }

  log(message) {
    this.logQueue.push(`${new Date(Date.now()).toISOString()}: ${message}`);

    if (!this.writing) this.writeLog();
  }

  async writeLog() {
    const logEntry = `${this.logQueue.join('\n')}`;

    this.logQueue = [];
    this.writing = true;

    await writeFile(this.filename, logEntry, {
      encoding: 'utf8',
    });

    if ((await this.fileSize) >= this.maxSize) {
      await this.rotateLog();
    }

    this.emit('messageLogged', logEntry);
    this.writing = false;

    if (this.logQueue.length) {
      await this.writeLog();
    }
  }

  async rotateLog() {
    await copyFile(this.filename, `${this.filename}.bk`);
    await writeFile(this.filename, '');
  }

  get fileSize() {
    return stat(this.filename)
      .then(stat => stat.size)
      .catch(() => 0);
  }
}
