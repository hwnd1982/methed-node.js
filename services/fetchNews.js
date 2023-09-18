import 'dotenv/config';
import chalk from 'chalk';
import https from 'node:https';
import process from 'node:process';

export const fetchNews = async (params = {}, country = 'RU') =>
  new Promise((resolve, reject) => {
    const url = new URL(process.env.API_URL);
    const withParams = !!Object.keys(params).length;

    if (withParams) {
      url.pathname = process.env.NEWS_EVERYTHING_PATH;
    } else {
      url.pathname = process.env.NEWS_TOP_PATH;
      url.searchParams.append('country', country);
      url.searchParams.append('pageSize', 10);
    }

    for (const key in params) {
      url.searchParams.append(key, params[key]);
    }

    url.searchParams.append('apiKey', process.env.API_KEY);

    const options = {
      hostname: url.host,
      path: url.pathname + url.search,
      headers: {
        'User-Agent': 'MethedParseApp/1.0.0',
      },
    };

    const req = https.request(options, res => {
      let data = '';

      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        const { articles } = JSON.parse(data);

        console.log('');
        console.log(chalk.green('Response data for GET request: ' + url));
        console.log('');

        if (articles) {
          resolve(articles);
        }

        resolve([]);
      });
    });

    req.on('error', error => {
      reject(error);
    });

    req.end();
  });
