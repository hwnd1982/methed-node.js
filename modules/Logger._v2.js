import { EventEmitter } from 'node:events';
import { writeFile, readFile, copyFile } from 'node:fs/promises';

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

    this.writeLog();
  }

  log(message) {
    const logMessage = `${new Date(Date.now()).toISOString()}: ${message}`;

    this.logQueue.push(logMessage);

    !this.writing && this.writeLog();
  }

  async writeLog() {
    try {
      this.writing = true;

      const logEntry = this.logQueue.length ? `${this.logQueue.shift()}` : '';
      let logFile = '';
      let newLog = logEntry;

      if (logEntry) {
        logFile = await readFile(this.filename, { encoding: 'utf8' });
      }

      if (logEntry && logFile) {
        newLog = `${logEntry}\n${logFile}\n`
          .slice(0, this.maxSize)
          .slice(0, newLog.lastIndexOf('\n'));
      }

      logEntry.length + logFile.length > this.maxSize &&
        (await this.rotateLog());

      await writeFile(this.filename, newLog);

      this.emit(
        'messageLogged',
        `${new Date(Date.now()).toISOString()}: ${
          logEntry ? 'log overwrite' : 'log created'
        } - size: ${newLog.length}byte;`,
      );

      this.writing = false;

      this.logQueue.length && (await this.writeLog());
    } catch (err) {
      this.log(err.message);
    }
  }

  async rotateLog() {
    await copyFile(this.filename, `${this.filename}.bak`);
  }
}
