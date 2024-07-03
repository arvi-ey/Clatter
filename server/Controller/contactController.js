const UserModel = require("../Model/usermodel")

exports.GetSingleContact = async (req, res) => {
    const id = req.params.id
    if (id) {
        try {
            const getContactResult = await UserModel.findById(id);
            if (getContactResult) res.send(getContactResult)
            else res.send("User not Found")
        }
        catch (err) {
            res.send(err)
        }
    }
    else return res.send("No User")
}

exports.SaveContact = async (req, res) => {
    const { email, number, userId, name } = req.body
    const emailExist = await UserModel.findOne({ email: email })
    if (emailExist) {
        const numberExist = await UserModel.findOne({ number: number })
        if (numberExist) {
            const savedContact = await UserModel.findByIdAndUpdate(userId, {
                $addToSet: {
                    saved_contact: {
                        id: numberExist._id,
                        saved_name: name
                    }
                },
            });
            const updatedUser = await UserModel.findById(userId);
            res.send(updatedUser);
        }
        else return res.send("No Mobile")
    }
    else return res.send("No Email")
}