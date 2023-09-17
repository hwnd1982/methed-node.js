import { readFileSync } from 'node:fs';
import https from 'node:https';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(302, {
    'Content-Type': 'text/plain',
    // Location: 'https://google.com',
    // 'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Origin': 'https://192.168.1.56:443/',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Set-Cookie': [
      'session=123456; Max-Age=3600; Secure; SameSite=None',
      'userId=789',
    ],
  });
  const cookes = req.headers.cookie;
  console.log(cookes);

  res.end('Hello! This HTTPS server...');
});

server.listen(443, () => {
  console.log('Сервер слушает порт 443');
});
