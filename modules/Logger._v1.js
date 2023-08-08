import { EventEmitter } from 'node:events';
import {
  stat,
  writeFile,
  copyFile,
  readFile,
  appendFile,
} from 'node:fs/promises';

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
    try {
      const logEntry = `${this.logQueue.shift()}\n`;

      this.writing = true;

      await appendFile(this.filename, logEntry, {
        encoding: 'utf8',
      });

      if ((await this.fileSize) >= this.maxSize) {
        await this.rotateLog();
      }

      this.emit('messageLogged', logEntry);

      if (this.logQueue.length) {
        await this.writeLog();
      }

      this.writing = false;
    } catch (err) {
      this.log(err.message);
    }
  }

  async rotateLog() {
    try {
      const log = await readFile(this.filename, 'utf8');

      let logLength = log.length;
      const logLines = log.split('\n');

      await copyFile(this.filename, `${this.filename}.bak`);

      for (let i = 0; logLength > this.maxSize && i < logLines.length; i++) {
        logLength -= logLines.shift().length;
      }

      await writeFile(this.filename, logLines.join('\n'));
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
