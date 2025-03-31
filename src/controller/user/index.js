const userCntrl = require("./getuserController")
const createUserCntrl = require("./createUserController")
const loginCntrl = require("./loginController")
const signUpCntrl = require("./signUpController")
const verifyOtpCntrl = require("./verifyOtpController")
const updateUserCntrl = require("./updateUserController")
const searchUserCntrl = require("./searchUserController.js")

module.exports = {
    user:userCntrl,
    create:createUserCntrl,
    login:loginCntrl,
    signup:signUpCntrl,
    verifyOTP:verifyOtpCntrl,
    update:updateUserCntrl,
    search:searchUserCntrl
}