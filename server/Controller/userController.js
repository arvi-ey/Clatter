const UserModel = require("../Model/usermodel")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

exports.UserSignUp = async (req, res) => {
    let { name, email, number, password, profile_image } = req.body;
    try {

        const emailResult = await UserModel.findOne({ email: email })
        if (emailResult) {
            res.send("Email already exists")
            return
        }
        const mobileResult = await UserModel.findOne({ number: number })
        if (mobileResult) {
            res.send("Mobile number already exists")
            return
        }
        if (!emailResult && !mobileResult) {
            bcrypt.genSalt(10, async function (err, salt) {
                bcrypt.hash(password, salt, async (err, hash) => {
                    const userresult = await UserModel.create({
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
}


exports.GetUser = async (req, res) => {
    res.status(200).json({ user: req.user })
}


exports.UpdateUser = async (req, res) => {
    const userid = req.params.id;
    const updatedData = req.body;
    try {
        if (updatedData.email) {
            const checkUser = await UserModel.findOne({ email: updatedData.email });
            if (checkUser) return res.send("This email already exists");
        }
        const user = await UserModel.findByIdAndUpdate(userid, updatedData, { new: true });
        if (!user) return res.status(404).send('User Not Found');
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


exports.GetSingleUer = async (req, res) => {
    const userid = req.params.id
    try {
        const user = await UserModel.findOne({ _id: userid })
        if (!user) return res.send("User does not exist")
        else res.send(user)
    }
    catch (err) {
        res.send(err.message)
    }
}

exports.UserSignin = async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email })
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
}


