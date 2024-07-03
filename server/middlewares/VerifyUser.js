const jwt = require("jsonwebtoken")
const userModel = require("../Model/usermodel")

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'sssssshh');
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;
