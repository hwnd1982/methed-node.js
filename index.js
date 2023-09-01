import http from 'node:http';
import { parse } from 'node:url';
import Questionnaire from './services/Questionnaire.js';

import chalk from 'chalk';

const fetchData = async url =>
  new Promise((resolve, reject) => {
    const { hostname, pathname } = parse(url);
    console.log(parse(url));
    const options = {
      hostname: 'js.methed.ru',
      path: '/',
      port: 443,
      headers: {
        'Content-type': 'text/html; application/xhtml',
        'User-Agent': 'MethedParseApp/1.0.0',
      },
    };

    // console.log(options.hostname + path);
    const req = http.request(options, res => {
      let data = '';

      res.on('data', chunk => (data += chunk));

      res.on('end', () => {
        console.log('');
        console.log(chalk.green('Response data for GET request'));
        console.log('');
        resolve(data);
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });

const app = async () => {
  const questionnaire = new Questionnaire(['Введите адрес страницы: ']);
  const [url] = await questionnaire.questioning;
  const data = await fetchData(url);

  data.replace(/<h(\d).*>(.*)<\/h\d>/gi, (match, level, inner) => {
    console.log(match, level, inner);
  });
};

app();
