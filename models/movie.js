const mongoose = require('mongoose');

const RegExpForLink = require('../utils/RegExpForLink');

const cardSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(RegExpForLink),
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(RegExpForLink),
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(RegExpForLink),
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(RegExpForLink),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameENG: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
