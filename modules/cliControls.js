import chalk from 'chalk';
import process from 'node:process';

const { stdin: input, stdout: output } = process;

export const write = str => output.write(str);

export const read = cb => {
  input.on('data', chunk => {
    cb(chunk.toString('utf8'));
  });
};

export const clear = () => write('\x1Bc');

export const pos = (row, col) => write(`\x1b[${row};${col}H`);

export const box = (row, col, height, width) => {
  const border = ['┌', '┐', '─', '│', '└', '┘'];
  const h = height - 2;
  const w = width - 2;

  pos(row, col);
  write(border[0] + border[2].repeat(w) + border[1]);
  for (let i = 1; i < h; i++) {
    pos(row + i, col);
    write(border[3] + ' '.repeat(w) + border[3]);
  }
  pos(row + h, col);
  write(border[4] + border[2].repeat(w) + border[5]);
};

export const progress = (row, col, length, values) => {
  box(row, col, 4, length + 2);
  values.forEach((value, index) => {
    pos(row + 1, col + 2 + index);

    if (value) {
      write(chalk.bgGreen(' '));
    } else if (value !== null) {
      write(chalk.bgRed(' '));
    } else {
      write(' ');
    }
  });
};
