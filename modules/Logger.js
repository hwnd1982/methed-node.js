import { EventEmitter } from 'node:events';
import { stat } from 'node:fs/promises';

class Logger extends EventEmitter {
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
      console.log('Записано сообщение:', message);
    });
  }

  log(massage) {
    this.logQueue.push({massage});
    if (!this.writing) this.writeLog();
  }

  async writeLog() {
    this.writing = true;

    this.writing = false;
  }

  rotateLog() {}

  get fileSize() {
    return stat(this.filename);
  }
}
