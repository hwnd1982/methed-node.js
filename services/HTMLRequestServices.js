import https from 'node:https';
import { parse } from 'node:url';
import chalk from 'chalk';

export const fetchHTML = async url =>
  new Promise((resolve, reject) => {
    const { hostname, pathname: path } = parse(`https://${url}`);
    const options = {
      hostname,
      port: 443,
      path,
      method: 'GET',
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'User-Agent': 'MethedParseApp/1.0.0',
      },
    };

    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        console.log('');
        console.log(chalk.green('Response data for GET request: ' + url));
        console.log('');
        resolve(data);
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });

export const parseHTML = data => {
  const links = [];
  const hesders = [];

  data.replace(/<h(\d).*>(.*)<\/h\d>/gi, (match, level, inner) => {
    hesders.push({ level, inner });
  });
  data.replace(/<a.*href="([^"]*)".*>(.*)<\/a>/gi, (match, href, inner) => {
    links.push({ href, inner });
  });

  return { links, hesders };
};

export const printHeadersList = headers => {
  if (!headers.length) {
    console.log(chalk.red('На странице остутствуют заголовки...'));
    return;
  }

  console.log(chalk.red('Список заголовкав:'));
  headers.forEach(({ level, inner }, index) => {
    console.log(
      `${
        '------------'.slice(-2 * level) + chalk.green(index + 1)
      }. ${chalk.magenta(inner)}`,
    );
  });
  console.log('');
};

export const printLinksList = links => {
  if (!links.length) {
    console.log(chalk.red('На странице остутствуют ссылки...'));
    return;
  }

  console.log(chalk.red('Список ссылок:'));
  links.forEach(({ href, inner }, index) => {
    console.log(
      `${chalk.green(index + 1)}. ${chalk.magenta(inner)} (${chalk.blue(
        href,
      )})`,
    );
  });
  console.log('');
};
