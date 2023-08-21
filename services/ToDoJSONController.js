import { EventEmitter } from 'node:events';
import chalk from 'chalk';
import { writeFile, readFile } from 'node:fs/promises';

export class ToDoJSONController extends EventEmitter {
  constructor(filename, init = true) {
    super();
    this.filename = filename;
    this.data = null;
    this.task = null;
    init && this.init();
  }

  init() {
    this.on('add', id =>
      console.log(
        chalk.blue(`\nЗадача добавлена с идентификатором ${chalk.cyan(id)}`),
      ),
    );

    this.on('update', id =>
      console.log(
        chalk.blue(`\nЗадача с индефикаторм ${chalk.cyan(id)} обновлена`),
      ),
    );

    this.on('list', list => {
      let massage = '';

      if (list.length) {
        massage =
          '\n' +
          list
            .map(({ id, status, task }) => {
              let line = `${id}. [${status}] ${task}`;

              if (status === 'Выполнено') {
                line = chalk.green(line);
              } else if (status === 'В работе') {
                line = chalk.yellow(line);
              } else {
                line = chalk.cyan(line);
              }

              return line;
            })
            .join('\n');
      } else {
        massage = chalk.magenta(' пуст...');
      }

      console.log(chalk.blue('\nСписок задач:') + massage);
    });

    this.on('status', id =>
      console.log(
        chalk.blue(
          `\nСтатус задачи с идентификатором ${chalk.cyan(id)} обновлен`,
        ),
      ),
    );

    this.on('get', ({ id, task, status }) =>
      console.log(
        `\n${chalk.blue('Задача с индентификатором')} ${chalk.cyan(id)}:\n` +
          `${chalk.blue('Название:')} ${chalk.cyan(task)}\n` +
          `${chalk.blue('Статус:')} ${chalk.cyan(status)}`,
      ),
    );

    this.on('delete', id =>
      console.log(
        chalk.red('\nЗадача с идентификатором ') +
          chalk.green(id) +
          chalk.red(' удалена'),
      ),
    );

    this.on('help', help => {
      console.log('');
      if (Object.keys(help).length > 1) {
        console.log(chalk.bold(chalk.green('Список команд приложения:')));
      }

      for (const key in help) {
        const [vars, text] = help[key].split(':');

        console.log(
          `   ${chalk.magenta(key)} ${chalk.red(vars + ':')} ${chalk.blue(
            text,
          )}`,
        );
      }
    });

    this.on('clear', () => console.log(chalk.red('\nСписок дел очищен...')));

    this.on('error', error => console.log('\n' + chalk.red(error)));
  }

  async add(task) {
    if (!task) {
      this.error('Вы забыли передать значение...');
      await this.help('add');
      return;
    }

    await this.read();
    this.data.push({ id: this.data.length + 1, task, status: 'В работе' });
    await this.write();
    this.emit('add', this.data.length);
  }

  async get(id) {
    if (!id) {
      this.error('Вы забыли передать значение...');
      await this.help('get');
      return;
    }

    await this.read();
    this.find(id);

    if (this.task) {
      this.emit('get', this.task);
    } else {
      this.error('Записи с таким идентификатором не обноружино...');
    }
  }

  async list() {
    await this.read();
    this.emit('list', this.data);
  }

  async status(id, value) {
    await this.read();
    this.find(id);

    if (this.task) {
      this.task.status = value;
      await this.write();
      this.emit('status', this.task.id);
    } else {
      this.error('Записи с таким идентификатором не обноружино...');
    }
  }

  async delete(id) {
    await this.read();
    this.find(id);

    if (this.task) {
      this.data = this.data.filter(item => +item.id !== +id);
      await this.write();
      this.emit('delete', id);
    } else {
      this.emit('error', 'Записи с таким идентификатором не обноружино...');
    }
  }

  async clear() {
    this.data = [];
    await writeFile(this.filename, JSON.stringify([]));
    this.emit('clear');
  }

  error(massage) {
    this.emit('error', massage);
  }

  async help(command) {
    const help = JSON.parse(
      await readFile('./files/help.json').catch(() => ''),
    );
    const options = command ? {} : help;

    if (command) {
      options[command] = help[command];
    }

    this.emit('help', options);
  }

  async read() {
    if (!this.data) {
      this.data =
        JSON.parse(await readFile(this.filename).catch(() => '[]')) || [];
    }
  }

  find(id) {
    this.task = this.data.find(task => +task.id === +id);
  }

  async write() {
    await writeFile(this.filename, JSON.stringify(this.data));
  }
}
