const asyncHandler = require('express-async-handler');
const moment = require('moment-timezone');
const { encryptData } = require('../utils/crypto');

const ApiError = require('../utils/apiError')
const UserModel = require('../models/userModel')


exports.updateProfileData = asyncHandler(async (req, res, next) => {

    const { name, username, email, verified } = req.body
    const user = await UserModel.findOneAndUpdate(req.user._id, {
        name,
        username,
        email,
        verified,
    },
        { new: true });

    if (!user) {
        next(new ApiError(404, 'User not found'))
    }

    res.status(200).json({
        status: 'success',
        message: 'User data updated successfully',
        result: user,
    })
});

exports.updateProfilePassword = asyncHandler(async (req, res, next) => {

    const { currentPassword, newPassword } = req.body
    const user = await UserModel.findOne(req.user._id);

    if (!user) {
        next(new ApiError(404, 'User not found'))
    }

    const encryptCurrentPassword = encryptData(currentPassword.toString());
    const encryptNewPassword = encryptData(newPassword.toString());

    if (encryptCurrentPassword != user.password.toString()) {
        next(new ApiError(404, 'Old password is incorrect'));
    }

    user.password = encryptNewPassword;

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'User password updated successfully',
    })
});