import http from 'node:http';

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts',
  port: 80,
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
    'User-Agent': 'MethedApp/1.0.0',
  },
};

const sendGetRequest = () => {
  options.method = 'GET';

  const req = http.request(options, res => {
    let data = '';

    res.on('data', chunk => (data += chunk));

    res.on('end', () => {
      console.log('Response data for GET request');
      console.log(JSON.parse(data));
    });
  });

  req.on('error', error => {
    console.log(error);
  });

  req.end();
};

// sendGetRequest();

const sendPostRequest = () => {
  options.method = 'POST';
  const req = http.request(options, res => {
    let data = '';

    res.on('data', chunk => (data += chunk));

    res.on('end', () => {
      console.log('Response data for GET request');
      console.log(JSON.parse(data));
    });
  });

  req.on('error', error => {
    console.log(error);
  });
  const postData = JSON.stringify({
    title: 'NodeJS',
    body: 'Testing data transmission in node.JS',
    userId: 1,
  });

  req.write(postData);
  req.end();
};

sendPostRequest();
