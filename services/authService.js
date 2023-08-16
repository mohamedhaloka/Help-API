const asyncHandler = require('express-async-handler');
var jwt = require('jsonwebtoken');

const { encryptData } = require('../utils/crypto');

const ApiError = require('../utils/apiError')
const UserModel = require('../models/userModel')

const generateToken = (userId) => {
    const privateKey = process.env.TOKEN_PRIVATE_KEY;
    return jwt.sign(userId, privateKey,);
}


exports.signUp = asyncHandler(async (req, res) => {

    req.body.password = encryptData(req.body.password);

    const user = await UserModel.create(req.body)

    const token = generateToken(user._id.toString());

    res.status(200).json({
        status: 'success',
        message: 'Sign Up successfully',
        result: {
            user,
            token: token,
        }
    })
})

exports.logIn = asyncHandler(async (req, res, next) => {

    const { account, password } = req.body

    const encryptedPassword = encryptData(password);

    const user = await UserModel.findOne({ email: account, password: encryptedPassword })

    if (!user) {
        next(new ApiError(404, 'Wrong credentials not found'))
    }
    const token = generateToken(user._id.toString());

    res.status(200).json({
        status: 'success',
        message: 'Login successfully',
        result: {
            user,
            token: token,
        }
    })
})