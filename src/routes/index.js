const express = require('express');
const userRouter = require('./userRoutes');
// const subscriptionRoutes = require('./subscriptionRoutes');
// const courseRoutes = require('./courseRoutes');
const routes = express.Router();

routes.use('/user', userRouter)


module.exports = routes;