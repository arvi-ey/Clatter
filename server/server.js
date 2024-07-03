require('dotenv').config();
const express = require('express')
const server = express()
const cookie_parser = require("cookie-parser")
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const UserRouter = require("./Route/userRouter")
const AuthRouter = require("./Route/authRouter")
const ContactRouter = require("./Route/contactRouter")
const MassageRouter = require("./Route/massageRouter")



server.use(cors());
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookie_parser())


const uri = "mongodb://127.0.0.1:27017/clatter";
mongoose.connect(uri)
    .then(() => {
        console.log("Successfully connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });


server.use('/user', UserRouter)
server.use('/auth', AuthRouter)
server.use('/contact', ContactRouter)
server.use('/massage', MassageRouter)


server.listen(5000, () => {
    console.log(`server is listening on PORT:5000`)
})