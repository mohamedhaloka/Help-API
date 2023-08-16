const asyncHandler = require('express-async-handler');
const { encryptData } = require('../utils/crypto');

const ApiError = require('../utils/apiError')
const UserModel = require('../models/userModel')


exports.getAllUsers = asyncHandler(async (req, res) => {
    const page = (req.query.page || 0) * 1;
    const limit = (req.query.limit || 10) * 1;
    const skip = page * limit
    const users = await UserModel.find(
        {
            name: { $regex: req.query.search }
        },
    ).skip(skip).limit(limit);

    res.status(200).json({
        status: 'success',
        message: 'Fetch users successfully',
        paginationData: {
            currentPage: page,
            limit: limit,
            itemsCount: users.length,
        },
        result: users,
    })
});

exports.getSpecificUserById = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json({
        status: 'success',
        message: 'Fetch user data successfully',
        result: user,
    })
});

exports.addNewUser = asyncHandler(async (req, res) => {

    req.body.password = encryptData(req.body.password);

    const users = await UserModel.create(req.body);

    res.status(200).json({
        status: 'success',
        message: 'User added successfully',
        result: users,
    })

})

exports.updateUser = asyncHandler(async (req, res, next) => {

    req.body.password = encryptData(req.body.password);

    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        result: user,
    })

})

exports.deactivateUser = asyncHandler(async (req, res, next) => {

    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    user.active = false;

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'User deactivated successfully',
        result: user,
    })

})