import { parse, format, resolve } from 'node:url';
import { stringify } from 'node:querystring'; // parse тоже есть;

const myUrl = 'https://methed.ru/path/file.html?user=maks&pass=123#order';
const parseUrl = parse(myUrl, true); // true - query Object;
const urlParams = {
  protocol: 'https:',
  host: 'methed.ru',
  hostname: 'methed.ru',
  hash: '#order',
  search: '?user=maks&pass=123',
  pathname: '/path/file.html',
};
const formattedUrl = format(urlParams);
const baseUrl = 'https://methed.ru/';
const urlPath = '/path/file.html';
const resolveUrl = resolve(baseUrl, urlPath); // не паримся с лишним слешем;
const queryParams = stringify(parseUrl.query);

console.log('parseUrl: ', parseUrl);
console.log('formattedUrl: ', formattedUrl);
console.log('resolveUrl: ', resolveUrl);
console.log('queryParams: ', queryParams);
