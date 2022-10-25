const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { WrongDataError } = require('../errors/wrong-data-error');
const { WrongEmailOrPasswordError } = require('../errors/wrong-email-or-password-error');
const { NotFoundError } = require('../errors/not-found-error');
const { EmailAlreadyExistError } = require('../errors/email-already-exist-error');

const { NODE_ENV, JWT_SECRET } = process.env;

function extractUser(user) {
  return {
    _id: user._id, email: user.email, name: user.name,
  };
}

module.exports.extractUser = extractUser;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(extractUser(user)))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send(extractUser(user)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new WrongDataError('Переданы некорректные данные при создании пользователя.');
      } else if (err.code === 11000) {
        next(new EmailAlreadyExistError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    // Передадим объект опций:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  ).then((user) => {
    if (user) {
      res.send(extractUser(user));
    } else throw new NotFoundError('Пользователь с указанным _id не найден.');
  }).catch((err) => {
    if (err.name === 'ValidationError') {
      next(new WrongDataError('Переданы некорректные данные при обновлении профиля.'));
    } else if (err.code === 11000) {
      next(new EmailAlreadyExistError('Пользователь с таким email уже существует'));
    } else {
      next(err);
    }
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: 604800 }, // токен будет просрочен через неделю после создания
      );
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      if (err === 'ValidationError') {
        next(new WrongEmailOrPasswordError('Некорректный Email или пароль'));
      } else {
        next(err);
      }
    });
};
