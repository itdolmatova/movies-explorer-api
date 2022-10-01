const jwt = require('jsonwebtoken');
const { WrongEmailOrPasswordError } = require('../errors/wrong-email-or-password-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new WrongEmailOrPasswordError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new WrongEmailOrPasswordError('Необходима авторизация');
  }

  req.user = payload;

  next();
  return undefined;
};
