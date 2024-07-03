const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    number: String,
    profile_image: String,
    password: String,
    dark_mode: {
        type: Boolean,
        default: false
    },
    saved_contact: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            saved_name: String
        }
    ]
})

module.exports = mongoose.model("user", userSchema)