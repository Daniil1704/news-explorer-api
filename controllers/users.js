const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../errors/NotFoundErr');
const ConflickErr = require('../errors/ConflictErr');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null || undefined) {
        throw new NotFoundErr({ message: 'Такого пользователя нет' });
      }
      res.status(200).send({
        email: user.email,
        name: user.name,
      });
    })
    .catch(next);
};

const buildUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflickErr({ message: 'Пользователь с таким email уже есть, введите другой email' });
      } else next(err);
    })
    .then((user) => res.status(201).send({ message: `Пользователь с ${user.email} зарегистрирован` }))
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret',
        { expiresIn: '24h' },
      );
      res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  login,
  buildUser,
  getUser,
};
