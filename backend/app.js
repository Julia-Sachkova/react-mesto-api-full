// require('dotenv').config();
const express = require('express');
// const { errors, celebrate, Joi } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
// const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const auth = require('./middlewares/auth');
// const cors = require('./middlewares/cors');
// const errorsHandler = require('./middlewares/errorsHandler');
// const { requestLogger, errorLogger } = require('./middlewares/logger');

// const NotFound = require('./errors/NotFound');
const { linkReg } = require('./utils/constants');

const app = express();
const { PORT = 3000 } = process.env;

// const allowedCors = [
//   'http://localhost:3000',
//   'https://localhost:3000',
//   'http://localhost:3001',
//   'https://localhost:3001',
//   'http://mesto.julia.practicum.nomoredomains.xyz',
//   'https://mesto.julia.practicum.nomoredomains.xyz',
//   'http://api.mesto.julia.practicum.nomoreparties.sbs',
//   'https://api.mesto.julia.practicum.nomoreparties.sbs',
// ];

// app.use(cors({
//   origin: allowedCors,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
// }));

// app.use(cors());

// const { login, createUser } = require('./controllers/users');
const { createUser } = require('./controllers/users');

// mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(cors);

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
//   if (req.method === 'OPTIONS') {
//     res.send(200);
//   }
//   next();
// });

// app.use(requestLogger);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// }), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(linkReg),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// app.use(auth);

// app.use(require('./routes/users'));
// app.use(require('./routes/cards'));

// app.all('*', (_req, _res, next) => {
//   next(new NotFound('Страница не найдена'));
// });

// app.use(errorLogger);

// app.use(errors());
// app.use((err, req, res, next) => {
//   const { statusCode = 500, message } = err;

//   res
//     .status(statusCode)
//     .send({
//       message: statusCode === 500
//         ? `На сервере произошла ошибка ${err}`
//         : message,
//     });
//   next();
// });

app.listen(PORT);
