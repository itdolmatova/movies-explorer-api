const mongoose = require('mongoose');

const { RegExpForLink } = require('../utils/RegExpForLink');
const { RegExpForRuName } = require('../utils/RegExpForRuName');
const { RegExpForEngName } = require('../utils/RegExpForEnName');

const movieSchema = new mongoose.Schema({
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
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(RegExpForRuName),
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(RegExpForEngName),
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
