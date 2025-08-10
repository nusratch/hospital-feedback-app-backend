const express = require('express');
const userRouter = require('./userRoutes');
const feedbackRoutes = require('./feedbackRoutes');
const authorityRoutes = require('./authorityRoutes');
const rolesRoutes = require('./rolesRoutes');
const routes = express.Router();

// Public routes
routes.use('/user', userRouter);

// Protected routes
routes.use('/feedback', feedbackRoutes);
routes.use('/authorities', authorityRoutes);
routes.use('/roles', rolesRoutes);


module.exports = routes;