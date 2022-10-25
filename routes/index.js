const app = require('express');
const signRouter = require('./sign');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');

const mainRouter = app.Router();

mainRouter.use(signRouter);
mainRouter.use(auth);
mainRouter.use(usersRouter);
mainRouter.use(moviesRouter);

module.exports.mainRouter = mainRouter;
