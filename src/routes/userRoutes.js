const express = require('express');
const accessToken = require("../middleware/accesstoken.js")
const userCntrl = require("../controller/user/index.js")
const UserReqValidator = require("../validator/userReqValidator.js")
const routes = express();

routes.post('/login', UserReqValidator.userLoginValidator, userCntrl.login)

routes.post('/sign-up', UserReqValidator.signUpValidator, userCntrl.signup)

routes.post('/verify-otp', UserReqValidator.verifyOtpValidator, userCntrl.verifyOTP)

routes.use(accessToken)
routes.post('/create-user', UserReqValidator.creatUserValidator, userCntrl.create)
routes.get('/get-user/:email', UserReqValidator.getUserValidator, userCntrl.user)
routes.put('/update-user/:id', UserReqValidator.updateUserValidator, userCntrl.update)
routes.post('/search-user', UserReqValidator.searchUserValidator, userCntrl.search)



module.exports = routes;