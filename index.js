import { readFileSync } from 'node:fs';
import https from 'node:https';

const options = {
  key: readFileSync('server-key.pem'),
  cert: readFileSync('server-cert.pem'),
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  res.end('Hello! This HTTPS server...');
});

server.listen(443, () => {
  console.log('Сервер слушает порт 443');
});
