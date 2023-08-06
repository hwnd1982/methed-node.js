import { EventEmitter } from 'node:events';
import { stat, appendFile, access } from 'node:fs/promises';
import { write } from './write.js';
import { readText } from './readText.js';

export class Logger extends EventEmitter {
  constructor(filename, maxSize, init = true) {
    super();
    this.filename = filename;
    this.maxSize = maxSize;
    this.logQueue = [];
    this.writing = false;
    this.promise = null;
    init && this.init();
  }

  init() {
    this.promise = access(this.filename).catch(async () => {
      this.promise = write(this.filename, '');
      this.log(`${this.filename} создан`);
    });

    this.on('messageLogged', message => {
      console.log('Записано сообщение:', message);
    });
  }

  log(massage) {
    this.logQueue.push(`${new Date(Date.now()).toISOString()}: ${massage}`);

    if (!this.writing) this.writeLog();
  }

  async writeLog() {
    const message = this.logQueue.join('\n') + '\n';
    this.writing = true;

    const size = await this.fileSize.size;
    if (size > this.fileSize) {
      const text = await readText(thi s.filename);
    }
    await appendFile(this.filename, message, { encoding: 'utf8' });
    this.emit('messageLogged', message);

    this.writing = false;
  }

  rotateLog() {}

  get fileSize() {
    return this.promise
      ? this.promise.then(() => stat(this.filename))
      : stat(this.filename);
  }
}

// class EE extends EventEmitter {
//   constructor({ name }) {
//     super();
//     this.name = name;
//   }

//   emit(name, ...args) {
//     super.emit(name, ...args);
//     console.log('logger', name, ...args);
//   }
// }

// class Timer extends EE {
//   constructor(init = true) {
//     super({ name: 'Timer' });
//     this.id = null;
//     this.tick = 0;
//     init && this.init();
//   }

//   init() {
//     this.on('tick', this.nextTick);
//   }

//   nextTick() {
//     console.log(`Tick - ${++this.tick}`);

//     this.id = setTimeout(() => {
//       this.emit('tick', this.tick);
//     }, 1000);
//   }

//   start() {
//     this.emit('tick', this.tick);
//   }

//   pause() {
//     this.id && clearTimeout(this.id);
//   }

//   reset() {
//     this.tick = 0;
//   }

//   stop() {
//     this.pause();
//     this.reset();
//   }
// }

// const timer = new Timer();

// timer.start();
// setTimeout(() => timer.pause(), 5000);
// setTimeout(() => timer.start(), 7000);
// setTimeout(() => timer.reset(), 10000);
// setTimeout(() => timer.stop(), 12000);

// class Messenger extends EE {
//   constructor(init = true) {
//     super('Messenger');
//     init && this.init();
//   }

//   init() {
//     this.on('message', this.receiveMessage);
//   }

//   receiveMessage({ username, message }) {
//     console.log(`${username}: ${message}`);
//   }

//   sendMessage(username, message) {
//     this.emit('message', { username, message });
//   }
// }

// const messenger = new Messenger({ name: 'Messenger' });

// messenger.sendMessage('Кирилл', 'Я сдал работу.');
// messenger.sendMessage('Максим', 'Молодец!');
