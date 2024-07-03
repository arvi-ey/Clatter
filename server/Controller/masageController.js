const MassageModel = require("../Model/massageModel")

exports.GetMassages = async (req, res) => {
    const { userId1, userId2 } = req.query;

    try {
        const MassageModels = await MassageModel.find({
            $or: [
                { sender: userId1, recipient: userId2 },
                { sender: userId2, recipient: userId1 }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(MassageModels);
    } catch (error) {
        res.status(500).json({ MassageModel: 'Error fetching MassageModels', error });
    }
}

exports.SendMassage = async (req, res) => {
    const { sender, recipient, content } = req.body;

    try {
        const newMassageModel = new MassageModel({
            sender,
            recipient,
            content,
            timestamp: new Date()
        });

        await newMassageModel.save();

        res.status(201).json(newMassageModel);
    } catch (error) {
        res.status(500).json({ MassageModel: 'Error sending MassageModel', error });
    }
}