import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { parse } from 'node:url';

const getUsers = async res => {
  try {
    const data = await readFile('./data/users.json', 'utf-8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(data);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Server Erorr');
  }
};

const server = createServer(async (req, res) => {
  const { method, url } = req;
  const parseUrl = parse(url, true);

  if (method === 'GET' && parseUrl.pathname === '/users') {
    return await getUsers(res);
  }

  if (method === 'POST' && parseUrl.pathname === '/users') {
    if (req.headers['content-type'] !== 'application/json') {
      res.statusCode = 415;
      res.setHeader('Content-Type', 'text/plain;');
      return res.end('Server accepts data only in JSON format');
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        const data = await readFile('./data/users.json', 'utf-8');
        const users = JSON.parse(data);

        userData.id = Math.random().toString(36).substring(2, 10);
        users.push(userData);
        await writeFile('./data/users.json', JSON.stringify(users));

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json;');
        res.end(JSON.stringify(userData));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Invalid Data Format');
      }
    });

    return;
  }

  if (method === 'DELETE' && parseUrl.pathname.startsWith('/users/')) {
    try {
      const userID = parseUrl.pathname.split('/').pop();
      const data = await readFile('./data/users.json', 'utf-8');
      const users = JSON.parse(data);
      const updatedUsers = users.filter(user => user.id !== userID);

      await writeFile('./data/users.json', JSON.stringify(updatedUsers));

      res.statusCode = 204;
      res.setHeader('Content-Length', '0');
      res.end();
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Server Erorr');
    }

    return;
  }

  if (method === 'PUTCH' && parseUrl.pathname.startsWith('/users/')) {
    let body = '';
    const userID = parseUrl.pathname.split('/').pop();

    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        let userData = JSON.parse(body);
        const data = await readFile('./data/users.json', 'utf-8');
        const users = JSON.parse(data);

        const updatedUsers = users.map(user => {
          if (user.id === userID) {
            userData = { ...user, ...userData };

            return userData;
          }

          return user;
        });

        await writeFile('./data/users.json', JSON.stringify(updatedUsers));

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(userData));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Server Erorr');
      }
    });

    return;
  }

  if (method === 'PUT' && parseUrl.pathname.startsWith('/users/')) {
    let body = '';
    const userID = parseUrl.pathname.split('/').pop();

    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        const data = await readFile('./data/users.json', 'utf-8');
        const users = JSON.parse(data);

        const updatedUsers = users.map(user => {
          if (user.id === userID) {
            userData.id = userID;

            return userData;
          }

          return user;
        });

        await writeFile('./data/users.json', JSON.stringify(updatedUsers));

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(userData));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Server Erorr');
      }
    });

    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Error 404: Not found');
});

server.listen(3001, 'localhost', () => {
  console.log('Сервер запущен на http://localhost:3001');
});
