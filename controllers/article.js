const Article = require('../models/article');
const BadRequestErr = require('../errors/BadRequestErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

const getArticle = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((article) => res.status(200).send(article))
    .catch(next);
};
const buildArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .catch((err) => {
      throw new BadRequestErr({ message: `Переданы не корректные данные: ${err.message}` });
    })
    .then((article) => res.status(201).send({
      _id: article._id,
      keyword: article.keyword,
      title: article.title,
      text: article.text,
      date: article.date,
      source: article.source,
      link: article.link,
      image: article.image,
    }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .select('+owner')
    .orFail(() => new NotFoundErr({ message: 'Нет такой статьи' }))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenErr({ message: 'Удалять можно только свои статьи' });
      }
      Article.findByIdAndDelete(req.params.articleId)
        .then(() => res.status(200).send({ message: 'Статья удалена' }))
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getArticle,
  buildArticle,
  deleteArticle,
};
