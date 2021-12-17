const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const mainRouter = require('./routers/mainRouter');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));
app.use(cors());

app.use('/', (req, res, next) => {
  res.status(200).send('Hello, world!');
});

app.use('/app', mainRouter);

app.listen(3080, () => {
  console.log('listend port : 3080');
});
