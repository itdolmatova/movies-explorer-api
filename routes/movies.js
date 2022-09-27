const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createMovie, getMovies, deleteMovieById,
} = require('../controllers/movies');
const { RegExpForLink } = require('../utils/RegExpForLink');
const { RegExpForEnName } = require('../utils/RegExpForEnName');
const { RegExpForRuName } = require('../utils/RegExpForRuName');

router.post('', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().pattern(RegExpForLink).required(),
    trailer: Joi.string().uri().pattern(RegExpForLink).required(),
    nameRU: Joi.string().pattern(RegExpForRuName).required(),
    nameEN: Joi.string().pattern(RegExpForEnName).required(),
    thumbnail: Joi.string().uri().pattern(RegExpForLink).required(),
    movieId: Joi.string().required(),
  }),
}), createMovie);

router.get('', getMovies);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
}), deleteMovieById);

module.exports = router;
