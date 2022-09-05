const jwt = require('jsonwebtoken');
require('dotenv').config();




// const existUser = await userModel.findOne({

//     Email: req.body.Email
// })
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        console.log('No token provided')
    }
    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const{_id, Name} = decoded;
        req.user = { _id, Name }
        next()
    } catch (error) {
        //throw new UnauthenticatedError('Not authorised to access route')
        console.log('Not authorised to access route')
    }
};

module.exports = authMiddleware
