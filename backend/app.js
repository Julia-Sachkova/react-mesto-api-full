require('dotenv').config();
const express = require('express');
const { errors, celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
// const cors = require('cors');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const allowedCors = [
//   'http://mesto.julia.practicum.nomoredomains.xyz',
//   'https://mesto.julia.practicum.nomoredomains.xyz',
//   'http://localhost:3000',
//   'https://localhost:3000',
//   'http://localhost:3001',
//   'https://localhost:3001'
// ]

const NotFound = require('./errors/NotFound');
const { linkReg } = require('./utils/constants');

const app = express();
const { PORT = 3000 } = process.env;

const allowedCors = [
  'http://localhost:3000',
  'https://localhost:3000',
  'http://mesto.julia.practicum.nomoredomains.xyz',
  'https://mesto.julia.practicum.nomoredomains.xyz',
  'https://api.mesto.julia.practicum.nomoreparties.sbs',
  'https://api.mesto.julia.practicum.nomoreparties.sbs',
];

app.use((req, res, next) => {
  // const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
});

// app.use(cors({
//   origin: allowedCors,
//   credentials: true
// }));

// app.use(cors());

const { login, createUser } = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkReg),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/cards'));

app.all('*', (_req, _res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use(errorsHandler);

app.listen(PORT);
