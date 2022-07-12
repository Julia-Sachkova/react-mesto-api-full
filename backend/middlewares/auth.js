const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const auth = (req, res, next) => {
  // const token = req.cookies.jwt;

  // if (!token) {
  //   throw new NotValidJwt('Требуется авторизация');
  // }
  // let playload;

  // try {
  //   playload = jwt.verify(token, JWT_SECRET);
  // } catch (err) {
  //   return next(new NotValidJwt('token is not valid'));
  // }

  // req.user = playload;
  // return next();
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw (res.status(401).send({ message: 'Авторизация не успешна' }));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_JWT');
    } catch (err) {
      next(res.status(401).send({ message: 'Авторизация не успешна' }));
    }

    req.user = payload;
    next();
  }
};

module.exports = auth;
