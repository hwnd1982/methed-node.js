import { EventEmitter } from 'node:events';
import {
  writeFile,
  readFile,
  copyFile,
  stat,
  truncate,
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

    // this.writeLog();
  }

  log(message) {
    const logMessage = `${new Date(Date.now()).toISOString()}: ${message}`;

    this.logQueue.unshift(logMessage);

    !this.writing && this.writeLog();
  }

  async writeLog() {
    try {
      this.writing = true;

      let logFile = '';
      const logEntry = this.logQueue.length ? this.logQueue.join('\n') : '';

      this.logQueue.length = 0;
      if (logEntry) {
        logFile = await readFile(this.filename).catch(err =>
          console.log(err.message),
        );
      }

      console.log(logEntry);

      // logFile и logEntry содержат все данные из лога зачем их сразу писать в файл без образки непонятно
      // размер можно понять по записываемым данным без всяких fs.stat
      // но я записвываю все в файл как-будто мгу оценить объем только после записи
      // было бы хорошо если мы бы делади append в файл тогда понятно,
      // мы его не читали и незнаем что полусилось, но в этом случае образать надо будет сверху
      // и переворачивать массив в этом для того чтобы дописывать снизу небыло бы необходимости
      // как не крути криво, но я бы больше оценивал работу студентов по количеству обращений к файлу
      // чем меньше тем лучше...

      await writeFile(
        this.filename,
        logEntry ? `${logEntry}${logFile ? '\n' + logFile : ''}` : '',
      );

      this.emit(
        'messageLogged',
        `${new Date(Date.now()).toISOString()}: ${
          logEntry ? 'log overwrite' : 'log created'
        } - size: ${logEntry.length + logFile.length + 1}byte;`,
      );

      (await this.fileSize) >= this.maxSize && (await this.rotateLog());

      this.writing = false;

      this.logQueue.length && (await this.writeLog());
    } catch (err) {
      this.log(err.message);
    }
  }

  async rotateLog() {
    let endOfLine = 0;
    await copyFile(this.filename, `${this.filename}.bak`);

    await truncate(this.filename, this.maxSize);
    endOfLine = (await readFile(this.filename)).lastIndexOf('\n');
    await truncate(this.filename, endOfLine);

    this.emit(
      'messageLogged',
      `${new Date(
        Date.now(),
      ).toISOString()}: log rotated - size: ${endOfLine}byte;`,
    );
  }

  get fileSize() {
    return stat(this.filename)
      .then(stat => stat.size)
      .catch(() => 0);
  }
}
