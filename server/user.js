const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/clatter")

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    number: String,
    profile_image: String,
    password: String
})

module.exports = mongoose.model("user", userSchema)