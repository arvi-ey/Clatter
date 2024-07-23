const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    number: String,
    image:{
        data:String,
        contentType:String
    },
    password: String,
    dark_mode: {
        type: Boolean,
        default: false
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    saved_contact: [
        {
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            saved_name: String
        }
    ]
})

module.exports = mongoose.model("user", userSchema)