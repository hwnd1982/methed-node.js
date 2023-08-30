import Questionnaire from './services/Questionnaire.js';
import {
  getTextFileNames,
  replaceTextAll,
} from './services/TextFileService.js';

const questions = [
  'Введите путь к дирректории: ',
  'Введите строку для поиска: ',
  'Введите строку для замены: ',
];

const app = async () => {
  const questionnaire = new Questionnaire(questions);
  const [dirPath, find, replace] = await questionnaire.questioning;

  await replaceTextAll(await getTextFileNames(dirPath), find, replace);
};

app();
