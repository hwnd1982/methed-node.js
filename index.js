import {
  fetchHTML,
  parseHTML,
  printHeadersList,
  printLinksList,
} from './services/HTMLRequestServices.js';
import Questionnaire from './services/Questionnaire.js';

const app = async () => {
  try {
    const questionnaire = new Questionnaire(['Введите адрес страницы: ']);
    const [url] = await questionnaire.questioning;
    const data = await fetchHTML(url.replace(/^http[s]*:\/\//gi, ''));
    const { links, hesders } = parseHTML(data);

    printHeadersList(hesders);
    printLinksList(links);
  } catch (err) {
    console.log(err);
  }
};

app();
