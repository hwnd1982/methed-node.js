import { readFile } from 'node:fs/promises';
import ControlsCLI from './modules/ControlsCLI.js';

const displayFinalReport = (userResponses, controls) => {
  let finalMessage = '';
  let finalMessageColor = '';
  const numberOfCorrectAnswers = userResponses.reduce(
    (numberOfCorrectAnswers, answer) => (numberOfCorrectAnswers += +answer),
  );

  if (numberOfCorrectAnswers / userResponses.length > 0.9) {
    finalMessage =
      'Отличный результат! Правильных ответов: ' +
      `${numberOfCorrectAnswers} из ${userResponses.length}`;
    finalMessageColor = 'green';
  } else if (numberOfCorrectAnswers / userResponses.length > 0.5) {
    finalMessage =
      'Хороший результат! Правильных ответов: ' +
      `${numberOfCorrectAnswers} из ${userResponses.length}`;
    finalMessageColor = 'blue';
  } else {
    finalMessage =
      'Вы дебил... Правильных ответов: ' +
      `${numberOfCorrectAnswers} из ${userResponses.length}`;
    finalMessageColor = 'red';
  }

  controls.go(2, 0).write(finalMessage, finalMessageColor).go(2, 0).exit();
};

const next = questions => {
  let currentQuestion = 0;
  const userResponses = Array(questions.length).fill(null);
  const controls = new ControlsCLI(1, 0);

  const next = (answer = null) => {
    let requestMessage = 'Ваш ответ: ';
    let requestMessageColor = 'blue';

    if (answer !== null) {
      const possibleAnswers = questions[currentQuestion - 1].options.map(
        (item, index) => index + 1,
      );

      if (!possibleAnswers.includes(+answer)) {
        currentQuestion--;
        requestMessage = 'Выберите ответ из списка: ';
        requestMessageColor = 'red';
      } else {
        userResponses[currentQuestion - 1] =
          +answer - 1 === questions[currentQuestion - 1].correctIndex;
      }
    }

    controls.clear().progress(userResponses);

    if (currentQuestion < questions.length) {
      const { question, options } = questions[currentQuestion];

      controls
        .write(`${++currentQuestion}. ${question}`, 'green', true)
        .list(options)
        .go(1, 0)
        .write(requestMessage, requestMessageColor);

      return;
    }

    displayFinalReport(userResponses, controls);
  };

  controls.read(next);
  next();
};

next(JSON.parse(await readFile('./files/question.json')));
