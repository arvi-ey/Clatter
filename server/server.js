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
    filename: (req, file, cb) => {
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


server.get('/getContacts/:id', async (req, res) => {
    const id = req.params.id
    if (id) {
        try {
            const getContactResult = await userModel.findById(id);
            if (getContactResult) res.send(getContactResult)
            else res.send("User not Found")
        }
        catch (err) {
            res.send(err)
        }
    }
    else return res.send("No User")
})


server.post('/saveContact', async (req, res) => {
    const { email, number, userId, name } = req.body
    const emailExist = await userModel.findOne({ email: email })
    if (emailExist) {
        const numberExist = await userModel.findOne({ number: number })
        if (numberExist) {
            const savedContact = await userModel.findByIdAndUpdate(userId, {
                $addToSet: {
                    saved_contact: {
                        id: numberExist._id,
                        number: numberExist.number,
                        email: numberExist.email,
                        saved_name: name
                    }
                }
            });
            res.send(savedContact)
        }
        else return res.send("No Mobile")
    }
    else return res.send("No Email")
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

server.patch("/edituser/:id", upload.single('profile_image'), async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    if (req.file) {
        updatedData.profile_image = `/uploads/${req.file.filename}`;
    }

    try {
        if (updatedData.email) {
            const existingUser = await userModel.findOne({ email: updatedData.email });
            if (existingUser) {
                return res.send("This email already exists");
            }
        }

        const user = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });
        if (!user) {
            return res.status(404).send('User Not Found');
        }

        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
});





server.listen(5000, () => {
    console.log(`server is listening on PORT:5000`)
})