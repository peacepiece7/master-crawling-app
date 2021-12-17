const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const mainRouter = require('./routers/main');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(
  cors({
    // Access-Control-Allow-Origin
    origin: 'http://localhost:3060',
    // origin: true,
    // 이걸 true로 해야 cookie가 전달이 됨 (front axios도 인자로 withCredentials : true )
    // Access-Control-Allow-Credentials
    credentials: true,
  })
);

app.use('/', (req, res, next) => {
  res.status(200).send('Hello, world!');
});

app.use('/app', mainRouter);

app.listen(3080, () => {
  console.log('listend port : 3080');
});
