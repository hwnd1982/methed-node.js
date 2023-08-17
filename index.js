import { readFile } from 'node:fs/promises';
import chalk from 'chalk';
import process from 'node:process';
import { write, read, clear, pos, progress } from './modules/cliControls.js';

const next = questions => {
  let currentQuestion = 0;
  const userResponses = Array(questions.length).fill(null);

  const next = (answer = null) => {
    if (answer !== null) {
      userResponses[currentQuestion - 1] =
        +answer - 1 === questions[currentQuestion - 1].correctIndex;
    }

    clear();
    progress(1, 0, questions.length, userResponses);
    pos(8, 0);

    if (currentQuestion < questions.length) {
      const { question, options } = questions[currentQuestion];

      write(chalk.green(`${currentQuestion + 1}. ${question}`));
      options.forEach((response, index) => {
        pos(9 + index, 0);
        write(`${index + 1}: ${response}`);
      });

      pos(10 + options.length, 0);
      write(chalk.blue('Ваш ответ: '));
      currentQuestion++;

      return;
    }

    const numberOfCorrectAnswers = userResponses.reduce(
      (numberOfCorrectAnswers, answer) => (numberOfCorrectAnswers += +answer),
    );
    pos(8, 0);
    if (numberOfCorrectAnswers / questions.length > 0.9) {
      write(
        chalk.green(
          'Отличный результат! Правильных ответов: ' +
            `${numberOfCorrectAnswers} из ${questions.length}`,
        ),
      );
    } else if (numberOfCorrectAnswers / questions.length > 0.5) {
      write(
        chalk.blue(
          'Хороший результат! Правильных ответов: ' +
            `${numberOfCorrectAnswers} из ${questions.length}`,
        ),
      );
    } else {
      write(
        chalk.red(
          'Вы дебил... Правильных ответов: ' +
            `${numberOfCorrectAnswers} из ${questions.length}`,
        ),
      );
    }
    pos(10, 0);
    process.exit();
  };

  next();
  read(next);
};

next(JSON.parse(await readFile('./files/question.json')));
