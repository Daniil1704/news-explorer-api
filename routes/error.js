const router = require('express').Router();
const NotFoundErr = require('../errors/NotFoundErr');

router.all('/', () => {
  throw new NotFoundErr({ message: 'Такого ресурса нет' });
});

module.exports = router;
