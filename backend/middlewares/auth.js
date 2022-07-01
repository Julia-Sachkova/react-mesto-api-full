const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const NoAccess = require('../errors/NoAccess');
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
    return next(new NoAccess('token is not valid'));
  }

  req.user = playload;
  return next();
};

module.exports = auth;
