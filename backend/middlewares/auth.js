const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'jsbduyG65asashvh3bSjhD7sSjhsdd' } = process.env;

const NotValidJwt = require('../errors/NotValidJwt');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new NotValidJwt('Требуется авторизация');
  }
  let playload;

  try {
    playload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new NotValidJwt('token is not valid'));
  }

  req.user = playload;
  return next();
};

module.exports = auth;
