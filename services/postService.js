const asyncHandler = require('express-async-handler');
const moment = require('moment-timezone');
const { encryptData } = require('../utils/crypto');

const ApiError = require('../utils/apiError')
const UserModel = require('../models/userModel')


exports.getLoggedUserPost = asyncHandler(async (req, res, next) => {

    const user = await UserModel.findById(req.user._id);

    if (!user) {
        next(new ApiError(404, 'User not found'))
    }

    res.status(200).json({
        status: 'success',
        message: 'Fetch user post successfully',
        result: user.post,
    })
});

exports.updateLoggedUserPost = asyncHandler(async (req, res, next) => {

    req.body.id = Math.random().toString(36).substr(2, 9).toString();
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { post: req.body },
        { new: true },
    );

    if (!user) {
        next(new ApiError(404, 'User not found'))
    }

    if (!req.body) {
        next(new ApiError(400, 'You must add post'))
    }


    res.status(200).json({
        status: 'success',
        message: 'Create user post successfully',
        post: user.post,
    })
});



exports.deleteLoggedUserPost = asyncHandler(async (req, res, next) => {

    const user = await UserModel.findById(req.user._id);

    if (!user) {
        next(new ApiError(404, 'User not found'))
    }

    user.post = undefined;

    await user.save()

    res.status(200).json({
        status: 'success',
        message: 'user post deleted successfully',
    })
});


exports.getAllPosts = asyncHandler(async (req, res, next) => {

    const page = (req.query.page || 0) * 1;
    const limit = (req.query.limit || 10) * 1;
    const skip = page * limit

    const maxDate = Date.now();
    const minDate = (new Date(maxDate)).setHours((new Date(maxDate)).getHours() - 3)

    console.log(Date(maxDate));
    console.log(Date(minDate));
    const users = await UserModel.find({
        'post.createdAt': {
            $gte: minDate,
            $lt: maxDate,
        }
    }).skip(skip).limit(limit);

    var posts = [];

    for (var i in users) {
        posts.push(users[i].post)
    }


    res.status(200).json({
        status: 'success',
        message: 'Fetch posts successfully',
        paginationData: {
            currentPage: page,
            limit: limit,
            itemsCount: users.length,
        },
        result: posts,
    })
});