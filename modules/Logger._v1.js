import { EventEmitter } from 'node:events';
import { stat, writeFile, readFile, appendFile } from 'node:fs/promises';

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
      this.writing = true;
      let fileSize = 0;
      const { logQueue, filename, maxSize } = this;
      const logEntry = logQueue.length ? `\n${logQueue.join('\n')}` : '';

      this.logQueue.length = 0;

      await appendFile(filename, logEntry, {
        encoding: 'utf8',
      });

      fileSize = await this.fileSize;
      fileSize >= maxSize && (fileSize = await this.rotateLog());

      this.emit(
        'messageLogged',
        `${new Date(Date.now()).toISOString()}: ${
          logEntry.length === fileSize ? 'log created' : 'log overwrite'
        } - size: ${fileSize}byte;`,
      );

      this.writing = false;

      this.logQueue.length && (await this.writeLog());
    } catch (err) {
      this.log(err.message);
    }
  }

  async rotateLog() {
    try {
      const { filename, maxSize } = this;
      let logFile = await readFile(filename);
      const size = logFile.length;

      writeFile(`${this.filename}.bak`, logFile);

      logFile = logFile.slice(logFile.length - maxSize);
      logFile = logFile.slice(logFile.indexOf('\n') + 1);

      await writeFile(this.filename, logFile);

      this.emit(
        'messageLogged',
        `${new Date(
          Date.now(),
        ).toISOString()}: log rotated to ${filename}.bak - size: ${size}byte`,
      );

      return logFile.length;
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
