import chalk from 'chalk';
import process from 'node:process';

const { stdin: input, stdout: output } = process;

class ControlsCLI {
  constructor(row = 0, col = 0) {
    this.startRow = row;
    this.startCol = col;
    this.row = row;
    this.col = col;
  }

  clear() {
    this.row = this.startRow;
    this.col = this.startCol;

    return this.write('\x1Bc');
  }

  go(row = 0, col = 0) {
    this.row += row;
    this.col += col;

    return this.pos();
  }

  pos() {
    return this.write(`\x1b[${this.row};${this.col}H`);
  }

  read(cb) {
    input.on('data', chunk => cb(chunk.toString('utf8')));

    return this;
  }

  write(str, color = 'white', eol = false) {
    output.write(chalk[color](str));

    return eol ? this.go(1, 0) : this;
  }

  box(height, width, color = 'white') {
    const boxInnerStartRow = this.row + 1;
    const boxInnerStartCol = this.col + 2;

    this.write('┌' + '─'.repeat(width - 2) + '┐', color, true);
    for (let i = 1; i < height - 2; i++) {
      this.write('│' + ' '.repeat(width - 2) + '│', color, true);
    }
    this.write('└' + '─'.repeat(width - 2) + '┘', color, true);

    this.row = boxInnerStartRow;
    this.col = boxInnerStartCol;

    return this.pos();
  }

  list(list, color = 'white') {
    list.forEach((item, index) => {
      this.write(`${index + 1}: ${item}`, color, true);
    });

    return this;
  }
  progress(values) {
    const length = values.length;
    const progress = values.indexOf(null);
    const progressNextStartRow = this.row + 7;
    const progressStartCol = this.col;

    this.box(7, length + 8, 'magenta')
      .go(0, 1)
      .write(
        `Вопросов: ${
          progress === -1 ? ` ${length}`.slice(-2) : ` ${progress}`.slice(-2)
        } из ${length}`,
        'cyan',
        true,
      )
      .box(4, length + 4, 'magenta');

    values.forEach(value => {
      if (value) {
        this.write(chalk.bgGreen(' ')).go(0, 1);
      } else if (value !== null) {
        this.write(chalk.bgRed(' ')).go(0, 1);
      } else {
        this.write(' ').go(0, 1);
      }
    });

    this.row = progressNextStartRow;
    this.col = progressStartCol;

    return this.pos();
  }

  exit() {
    process.exit();
  }
}

export default ControlsCLI;
