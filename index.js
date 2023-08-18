import { readFile } from 'node:fs/promises';
import ControlsCLI from './modules/ControlsCLI.js';

const next = questions => {
  let currentQuestion = 0;
  const userResponses = Array(questions.length).fill(null);
  const controls = new ControlsCLI(1, 0);

  const next = (answer = null) => {
    let finalMessage = '';
    let finalMessageColor = '';
    let numberOfCorrectAnswers = 0;

    if (answer !== null) {
      userResponses[currentQuestion - 1] =
        +answer - 1 === questions[currentQuestion - 1].correctIndex;
    }

    controls.clear().progress(userResponses);

    if (currentQuestion < questions.length) {
      const { question, options } = questions[currentQuestion];

      controls
        .write(`${++currentQuestion}. ${question}`, 'green', true)
        .list(options)
        .go(1, 0)
        .write('Ваш ответ: ', 'blue');

      return;
    }

    numberOfCorrectAnswers = userResponses.reduce(
      (numberOfCorrectAnswers, answer) => (numberOfCorrectAnswers += +answer),
    );

    if (numberOfCorrectAnswers / questions.length > 0.9) {
      finalMessage =
        'Отличный результат! Правильных ответов: ' +
        `${numberOfCorrectAnswers} из ${questions.length}`;
      finalMessageColor = 'green';
    } else if (numberOfCorrectAnswers / questions.length > 0.5) {
      finalMessage =
        'Хороший результат! Правильных ответов: ' +
        `${numberOfCorrectAnswers} из ${questions.length}`;
      finalMessageColor = 'blue';
    } else {
      finalMessage =
        'Вы дебил... Правильных ответов: ' +
        `${numberOfCorrectAnswers} из ${questions.length}`;
      finalMessageColor = 'green';
    }

    controls.go(2, 0).write(finalMessage, finalMessageColor).go(2, 0).exit();
  };

  controls.read(next);
  next();
};

next(JSON.parse(await readFile('./files/question.json')));
