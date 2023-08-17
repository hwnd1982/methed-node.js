import chalk from 'chalk';
import process from 'node:process';

const { stdin: input, stdout: output } = process;

export const write = (str, color = 'white') => output.write(chalk[color](str));

export const read = cb => {
  input.on('data', chunk => {
    cb(chunk.toString('utf8'));
  });
};

export const clear = () => write('\x1Bc');

export const pos = (row, col) => write(`\x1b[${row};${col}H`);

export const box = (row, col, height, width, color = 'white') => {
  const border = ['┌', '┐', '─', '│', '└', '┘'];
  const h = height - 2;
  const w = width - 2;

  pos(row, col);
  write(border[0] + border[2].repeat(w) + border[1], color);
  for (let i = 1; i < h; i++) {
    pos(row + i, col);
    write(border[3] + ' '.repeat(w) + border[3], color);
  }
  pos(row + h, col);
  write(border[4] + border[2].repeat(w) + border[5], color);
};

export const progress = (row, col, length, values) => {
  const progress = values.indexOf(null);
  box(row, col, 7, length + 8, 'magenta');
  pos(row + 1, col + 4);
  write(
    `Вопросов: ${
      progress === -1 ? ` ${length}`.slice(-2) : ` ${progress}`.slice(-2)
    } из ${length}`,
    'cyan',
  );
  box(row + 2, col + 3, 4, length + 4, 'magenta');
  values.forEach((value, index) => {
    pos(row + 3, col + 5 + index);

    if (value) {
      write(chalk.bgGreen(' '));
    } else if (value !== null) {
      write(chalk.bgRed(' '));
    } else {
      write(' ');
    }
  });
};
