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

exports.processToken = asyncHandler(async (req, res, next) => {
    //Check Authentication Bearer token
    const headers = req.headers

    if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
        next(new ApiError(401, 'User not authenticated, you should add JWT'))
    }

    //Verify the token
    const userId = jwt.verify(headers.authorization.split(" ")[1], process.env.TOKEN_PRIVATE_KEY)

    //Verify the user is still exist
    const user = await UserModel.findById(userId);

    if (!user) {
        next(new ApiError(404, 'User not exist'))
    }

    req.user = user;
    next()
})

exports.allowFor = (...roles) => (req, res, next) => {
    req.user.role

    if (!roles.includes(req.user.role)) {
        next(new ApiError(400, `User not authorized to use this role, only allowed for ${roles}`))
    }

    next()
}


exports.forgetPassword = asyncHandler(async (req, res, next) => {
    // Check the email is linked to account
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
        next(new ApiError(404, "User not Found"))
    }
    // Generate code for 6 digits
    const code = Math.floor(Math.random() * 899999 + 100000)

    user.verificationCodeHashed = encryptData(code.toString())
    user.verificationCodeExpired = Date.now() + 60 * 10 * 1000
    user.verificationCodeDone = false;


    await user.save()
    res.status(200).json({
        status: 'success',
        message: 'Verification Code Send To Your Email Address',
        code: code,
    })
})

exports.verifyCode = asyncHandler(async (req, res, next) => {
    // Check the email is linked to account
    const user = await UserModel.findOne({
        email: req.body.email,
        verificationCodeExpired: { $gt: Date.now() },
    })

    if (!user) {
        next(new ApiError(404, "Verification Code Expired"));
    }


    // Check code is valid
    req.body.code = encryptData(req.body.code.toString())
    if (user.verificationCodeHashed != req.body.code) {
        next(new ApiError(400, "Verification Code Wrong"));
    }

    user.verificationCodeDone = true;

    await user.save()

    res.status(200).json({
        status: 'success',
        message: 'Verification Successfully',
    })
})


exports.resetPassword = asyncHandler(async (req, res, next) => {

    req.body.password = encryptData(req.body.password)

    const user = await UserModel.findOneAndUpdate({
        email: req.body.email,
        verificationCodeExpired: { $gt: Date.now() },
    }, {
        password: req.body.password
    },
        {
            new: true
        },
    )

    if (!user) {
        next(new ApiError(404, "User not found"));
    }

    user.verificationCodeHashed = undefined
    user.verificationCodeExpired = undefined
    user.verificationCodeDone = undefined

    await user.save()

    res.status(200).json({
        status: 'success',
        message: 'Change password successfully, login again',
    })
})