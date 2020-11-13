const jwt = require('jsonwebtoken');
const AuthorizationErr = require('../errors/AuthorizationErr');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationErr({ message: 'Что-то не так с авторизацией' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret'}`,
    );
  } catch (err) {
    throw new AuthorizationErr({ message: 'Что-то не так с авторизацией' });
  }
  req.user = payload;
  next();
};
