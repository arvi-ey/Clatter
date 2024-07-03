const express = require("express")
const { GetUser, UpdateUser, GetSingleUer } = require('../Controller/userController')
const Router = express.Router()
const verifyToken = require('../middlewares/VerifyUser')



Router.route('/')
    .get(verifyToken, GetUser)


Router.route('/:id')
    .get(GetSingleUer)
    .patch(UpdateUser)

module.exports = Router