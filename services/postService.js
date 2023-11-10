const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose')
const moment = require('moment-timezone');

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

    const { title, description, createdAt } = req.body;
    const user = await UserModel.findById(req.user._id);

    if (!user) {
        next(new ApiError(404, 'User not found'))
    }

    if (!req.body) {
        next(new ApiError(400, 'You must add post'))
    }
    if (user.post.id === undefined) {
        var id = new mongoose.Types.ObjectId();
        user.post.id = id;
    }

    user.post.user = req.user._id;
    user.post.title = title;
    user.post.description = description;
    user.post.createdAt = createdAt;

    await user.save()

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

    const maxDate = Date.now(); //Time as UTC
    const minDate = (new Date(maxDate)).setHours((new Date(maxDate)).getHours() - 3)

    const users = await UserModel.find({
        'post.createdAt': {
            $gte: minDate,
            $lt: maxDate,
        }
        // "post.likes": { $not: { $size: 0 } },
    }).skip(skip).limit(limit).populate({ path: 'post.user', select: 'name profilePhoto' });

    var posts = [];

    for (var i in users) {
        if (!users[i].post.title) {
            continue;
        }
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

exports.addLike = asyncHandler(async (req, res, next) => {

    if (req.params.id === req.user._id.toString()) {
        next(new ApiError(404, 'You can not add like to your post'))
    }

    const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
            $addToSet: { "post.likes": req.user._id, }

        },
        { new: true },
    );

    if (!user) {
        next(new ApiError(404, 'User not found'))
    }

    res.status(200).json({
        status: 'success',
        message: 'Add Like to post successfully',
        post: user.post,
    })
});
