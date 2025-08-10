const express = require('express');
const accessToken = require("../middleware/accesstoken.js")
const feedbackCntrl = require("../controller/feedback/index.js")
const FeedbackReqValidator = require("../validator/feedbackReqValidator.js")
const routes = express();

// routes.use(accessToken)

routes.post('/new-feedback', FeedbackReqValidator.feedback, feedbackCntrl.feedback)

routes.get('/feedback-list/:uid', FeedbackReqValidator.feedbackList, feedbackCntrl.feedbackList)


module.exports = routes;