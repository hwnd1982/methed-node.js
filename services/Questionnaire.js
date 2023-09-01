import chalk from 'chalk';
import process from 'node:process';

const { stdin: input, stdout: output } = process;

class Questionnaire {
  constructor(questions, init = true) {
    if (!questions || !questions.length) {
      return null;
    }

    this.questions = questions;
    this.answers = [];
    this.questioning = null;
    if (init) {
      this.init();
    }
  }

  init() {
    this.questioning = new Promise(resolve => {
      input.on('data', chunk => {
        const answer = chunk.toString('utf8').trim();

        if (answer && this.answers.length < this.questions.length) {
          this.answers.push(answer);
        } else {
          this.exit();
        }

        if (this.answers.length < this.questions.length) {
          return this.ask();
        }

        console.log('');
        resolve(this.answers);
      });
    });

    this.ask();
  }

  ask() {
    output.write(chalk.magenta(this.questions[this.answers.length]));
  }

  exit() {
    process.exit();
  }
}

export default Questionnaire;