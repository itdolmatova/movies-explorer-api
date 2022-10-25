require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');

const { mainRouter } = require('./routes/index');

const { errorHandler } = require('./errors/errorHandler');
const { NotFoundError } = require('./errors/not-found-error');
const { requestLogger, errorLogger } = require('./middlewares/logger');

console.log('Environment', process.env.NODE_ENV);

const { PORT = 3000 } = process.env;
const app = express();
const allowedCors = [
  'https://place4orthebeauty.dolmatova.nomoredomains.sbs',
  'http://place4orthebeauty.dolmatova.nomoredomains.sbs',
  'http://localhost:3000',
];

const { MONGO_URI = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;
mongoose.connect(MONGO_URI)
  .then(() => console.log('Database Connected'), {
    autoIndex: true,
  })
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    const requestHeaders = req.headers['access-control-request-headers'];
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    return res.end();
  }

  return next();
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(requestLogger);

app.use(mainRouter);
app.use((req, res, next) => {
  next(new NotFoundError('Некорректный роут'));
});

app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
