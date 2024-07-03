const express = require("express")
const Router = express.Router()
const { GetSingleContact, SaveContact } = require("../Controller/contactController")

Router.route('/')
    .post(SaveContact)

Router.route('/:id')
    .get(GetSingleContact)

module.exports = Router