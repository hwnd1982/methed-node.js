import { readFile } from 'node:fs/promises';
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

      write(`${currentQuestion + 1}. ${question}`, 'green');
      options.forEach((response, index) => {
        pos(9 + index, 0);
        write(`${index + 1}: ${response}`);
      });

      pos(10 + options.length, 0);
      write('Ваш ответ: ', 'blue');
      currentQuestion++;

      return;
    }

    const numberOfCorrectAnswers = userResponses.reduce(
      (numberOfCorrectAnswers, answer) => (numberOfCorrectAnswers += +answer),
    );
    pos(8, 0);
    if (numberOfCorrectAnswers / questions.length > 0.9) {
      write(
        'Отличный результат! Правильных ответов: ' +
          `${numberOfCorrectAnswers} из ${questions.length}`,
        'green',
      );
    } else if (numberOfCorrectAnswers / questions.length > 0.5) {
      write(
        'Хороший результат! Правильных ответов: ' +
          `${numberOfCorrectAnswers} из ${questions.length}`,
        'blue',
      );
    } else {
      write(
        'Вы дебил... Правильных ответов: ' +
          `${numberOfCorrectAnswers} из ${questions.length}`,
        'red',
      );
    }
    pos(10, 0);
    process.exit();
  };

  next();
  read(next);
};

next(JSON.parse(await readFile('./files/question.json')));
