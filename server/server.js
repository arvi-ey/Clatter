const express = require('express')
const server = express()
const cookie_parser = require("cookie-parser")
const userModel = require("./user")
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const bodyParser = require('body-parser')
const verifyToken = require("./middlewares/VerifyUser")
const multer = require('multer');
const path = require('path');

server.use(cors());
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookie_parser())

server.get("/", (req, res) => {
    res.send("HELLO SERVER")
})
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
server.post("/createuser", async (req, res) => {
    let { name, email, number, password, profile_image } = req.body;
    try {

        const emailResult = await userModel.findOne({ email: email })
        if (emailResult) {
            res.send("Email already exists")
            return
        }
        const mobileResult = await userModel.findOne({ number: number })
        if (mobileResult) {
            res.send("Mobile number already exists")
            return
        }
        if (!emailResult && !mobileResult) {
            bcrypt.genSalt(10, async function (err, salt) {
                bcrypt.hash(password, salt, async (err, hash) => {
                    const userresult = await userModel.create({
                        name, email, number, profile_image, password: hash
                    })
                    res.send(userresult)
                });
            });
        }
    }
    catch (er) {
        res.send(er)
    }
})


server.get('/getUser', verifyToken, (req, res) => {
    res.status(200).json({ user: req.user })
})

server.post("/signin", async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) return res.send("Email dosen't exist")
    else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                let token = jwt.sign({ id: user._id, email: user.email }, "sssssshh")
                res.send({ token, user })
            }
            else res.send("Password is incorrect")
        })
    }
})



server.get("/getuser/:id", async (req, res) => {
    const userid = req.params.id
    try {
        const user = await userModel.findOne({ _id: userid })
        if (!user) return res.send("User does not exist")
        else res.send(user)
    }
    catch (err) {
        res.send(err.message)
    }
})

server.patch("/edituser/:id", async (req, res) => {
    const userid = req.params.id
    const updatedData = req.body
    try {
        const user = await userModel.findByIdAndUpdate({ _id: userid }, updatedData, { new: true })
        if (!user) return res.send('User Not Found')
        else res.send(user).status(200)
    }
    catch (err) {
        res.send(err.message).status(500)
    }
})



server.listen(5000, () => {
    console.log(`server is listening on PORT:5000`)
})