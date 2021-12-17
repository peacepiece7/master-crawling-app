const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
  console.log('get a request!');
  res.status(200).send('Hi');
});

app.listen(3050, () => {
  console.log('connedted listen port : 3050');
});
