import process from 'node:process';
import {
  displayArticle,
  displayError,
  displayHelp,
} from './utils/displayInfo.js';
import { fetchNews } from './services/fetchNews.js';
import { argsParse } from './utils/argsParse.js';

const app = async () => {
  try {
    const options = argsParse(process.argv);

    if (options.error) {
      displayError(options.error);
      return;
    }

    if (options.help) {
      displayHelp();
      return;
    }

    displayArticle(await fetchNews(options));
  } catch (err) {
    console.log(err);
  }
};

app();
