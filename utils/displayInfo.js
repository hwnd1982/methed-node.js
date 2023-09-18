/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
import chalk from 'chalk';

const CLI_HELP = `
  ${chalk.green('Вы сожете поспользоваться следующими командами:')}
    ${chalk.red('-q')} ${chalk.yellow('< "ключевое слово" >')} - ${chalk.magenta('новостные статьи, связанные с указанным ключевым словом;')}
    ${chalk.red('-l')} ${chalk.yellow('< язык > (ru, en...)')} - ${chalk.magenta('новостные статьи на выбранном языке;')}
    ${chalk.red('-c')} ${chalk.yellow('< категория > (technology, health, science...)')} - ${chalk.magenta('новостные статьи из указанной категории;')}
    ${chalk.red('-s')} ${chalk.yellow('< число >')} - ${chalk.magenta('количество новостных статей на каждой странице;')}

`;

export const displayArticle = news => {
  news.forEach(
    ({ title, source: { name }, author, url, description }, index) => {
      console.log(chalk.bgGray(chalk.cyan(`${index + 1}. ${title}`)));
      if (description) {
        console.log();
        console.log(description);
      }
      console.log();
      console.log(
        chalk.magenta(
          `Источник: ${name}, ` +
            (author ? chalk.green(`Автор ${author};`) : ''),
        ),
      );
      console.log(chalk.blue(`Ссылка: ${url};`));
      console.log();
    },
  );
};

export const displayHelp = () => console.log(CLI_HELP);

export const displayError = error => console.log('\n', chalk.red(error));
