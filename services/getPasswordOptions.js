import process from 'node:process';
import readline from 'node:readline';
import util from 'node:util';
import chalk from 'chalk';

const { stdin: input, stdout: output } = process;
const rl = readline.createInterface({ input, output });
const question = util.promisify(rl.question).bind(rl);

export const getPasswordOptions = async () => {
  const length =
    +(await question(chalk.blue(' Длина пароля ') + chalk.red('[8]') + ': ')) ||
    8;
  const uppercase =
    ((await question(
      chalk.blue(' Включить заглавные буквы ') +
        chalk.magenta('(y/n) ') +
        chalk.red('[y]') +
        ': ',
    )) || 'y') === 'y';
  const numbers =
    ((await question(
      chalk.blue(' Включить числа ') +
        chalk.magenta('(y/n) ') +
        chalk.red('[y]') +
        ': ',
    )) || 'y') === 'y';
  const special =
    ((await question(
      chalk.blue(' Включить спецсимволы ') +
        chalk.magenta('(y/n) ') +
        chalk.red('[y]') +
        ': ',
    )) || 'y') === 'y';

  return {
    length,
    uppercase,
    numbers,
    special,
  };
};
