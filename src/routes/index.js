const express = require('express');
const userRouter = require('./userRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const routes = express.Router();

routes.use('/user', userRouter)
routes.use('/feedback', feedbackRoutes)


module.exports = routes;