const express = require("express")
const Router = express.Router()
const { GetMassages, SendMassage } = require("../Controller/masageController")

Router.route('/')
    .get(GetMassages)
    .post(SendMassage)

module.exports = Router