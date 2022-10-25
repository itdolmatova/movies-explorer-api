const Movie = require('../models/movie');
const { extractUser } = require('./users');
const { WrongDataError } = require('../errors/wrong-data-error');
const { NotFoundError } = require('../errors/not-found-error');
const { WrongUserError } = require('../errors/wrong-user-error');

const extractMovie = (movie) => {
  const {
    country, director, duration, year, description, image, trailerLink,
    nameRU, nameEN, thumbnail, movieId,
  } = movie;
  return {
    _id: movie._id,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: (movie.owner ? extractUser(movie.owner) : null),
  };
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    trailerLink,
    owner: req.user._id,
  })
    .then((movie) => res.send(extractMovie(movie)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate(['owner'])
    .then((movies) => res.send(movies.map((movie) => extractMovie(movie))))
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден.');
      }
      if (movie.owner._id.toString() !== req.user._id) {
        throw new WrongUserError('Фильм создан не Вами, запрещено удалять чужие фильмы');
      }
      return movie.remove();
    }).then(() => {
      res.send({ message: 'Фильм удален из сохраненных' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Передан некорректный _id для удаления фильма.'));
      } else {
        next(err);
      }
    });
};
