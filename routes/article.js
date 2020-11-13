const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validatorLink } = require('../middlewares/validate.js');

const {
  getArticle,
  buildArticle,
  deleteArticle,
} = require('../controllers/article');

router.get('/articles', getArticle);

router.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validatorLink),
    image: Joi.string().required().custom(validatorLink),
  }).unknown(true),
}), buildArticle);

router.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().hex().length(24),
  }).unknown(true),
}), deleteArticle);

module.exports = router;
