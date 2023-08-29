import process from 'node:process';
import chalk from 'chalk';
import { generatePassword } from './services/generatePassword.js';
import { argsParse } from './utils/argsParse.js';
import { getPasswordOptions } from './services/getPasswordOptions.js';
import { saveSettings, getSettings } from './services/settings.service.js';

const app = async () => {
  const args = argsParse(process.argv, ['ask', 'settings']);
  const options = {
    length: 8,
    uppercase: false,
    numbers: false,
    special: false,
  };

  if (!args.settings) {
    Object.assign(options, await getSettings());
  }

  if (args.h || args.help) {
    console.log(
      `${
        chalk.blue('-h --help', 'blue') +
        chalk.green(' - помощь, список команд (игнорирует другие команды);\n')
      }${chalk.blue('-l --length') + chalk.green(' - длина пароля (8);\n')}${
        chalk.blue('-u --uppercase') +
        chalk.green(' - включить заглавные буквы;\n')
      }${chalk.blue('-n --numbers') + chalk.green(' - включить числа;\n')}${
        chalk.blue('-s --special') + chalk.green(' - включить спецсимволы;\n')
      }${
        chalk.blue('-a --ask') +
        chalk.green(' - запустить опрос (игнорирует другие команды);\n')
      }${
        chalk.blue('settings') +
        chalk.green(' - сохраняет настройки из параметров -l -u -n -s;\n')
      }`,
    );

    process.exit();
    return;
  }

  if (args.a || args.ask) {
    console.log(chalk.magenta('Ответьте на вопросы\n'));

    console.log(
      `\n ${chalk.blue('Пароль:')}  ${chalk.red(
        generatePassword(await getPasswordOptions()),
      )}`,
    );

    process.exit();
  }

  if (args.l || args.length) {
    options.length = +args.l || +args.length || 8;
  }

  if (args.u || args.uppercase) {
    options.uppercase = args.u || args.uppercase;
  }

  if (args.n || args.numbers) {
    options.numbers = args.n || args.numbers;
  }

  if (args.s || args.special) {
    options.special = args.s || args.special;
  }

  if (args.settings) {
    await saveSettings(options);
    process.exit();
  }

  console.log(
    `${chalk.blue('Пароль:')}  ${chalk.red(generatePassword(options))}`,
  );

  process.exit();
};

app();
