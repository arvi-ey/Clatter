const express = require("express")
const { UserSignUp, UserSignin } = require('../Controller/userController')
const Router = express.Router()


Router.route('/signin')
    .post(UserSignin)

Router.route('/signup')
    .post(UserSignUp)


module.exports = Router