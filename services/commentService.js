const asyncHandler = require('express-async-handler');
const { encryptData } = require('../utils/crypto');

const ApiError = require('../utils/apiError')
const UserModel = require('../models/userModel')
const CommentModel = require('../models/commentModel')


exports.getAllComments = asyncHandler(async (req, res) => {
    const page = (req.query.page || 0) * 1;
    const limit = (req.query.limit || 10) * 1;
    const skip = page * limit
    console.log(req.query.id)
    const comments = await CommentModel.find({ postId: req.query.id }).skip(skip).limit(limit);

    res.status(200).json({
        status: 'success',
        message: 'Fetch comments successfully',
        paginationData: {
            currentPage: page,
            limit: limit,
            itemsCount: comments.length,
        },
        result: comments,
    })
});

exports.getSpecificCommentById = asyncHandler(async (req, res, next) => {
    const comment = await CommentModel.findById(req.params.id);

    if (!comment) {
        return next(new ApiError(404, 'Comment not found'));
    }

    res.status(200).json({
        status: 'success',
        message: 'Fetch comment successfully',
        result: comment,
    })
});

exports.addComment = asyncHandler(async (req, res) => {

    const { comment, postId } = req.body;

    const commentQuery = await CommentModel.create({
        comment,
        user: req.user._id,
        postId,
    });

    res.status(200).json({
        status: 'success',
        message: 'Comment added successfully',
        result: commentQuery,
    })

})

exports.updateComment = asyncHandler(async (req, res) => {

    const { comment } = req.body;

    const commentQuery = await CommentModel.findOneAndUpdate({ _id: req.params.id }, {
        comment,
    }, { new: true });

    res.status(200).json({
        status: 'success',
        message: 'Comment added successfully',
        result: commentQuery,
    })

})


exports.deleteComment = asyncHandler(async (req, res, next) => {

    const comment = await CommentModel.findOneAndDelete(req.params.id);

    if (!comment) {
        return next(new ApiError(404, 'Comment not found'));
    }

    res.status(200).json({
        status: 'success',
        message: 'Comment deleted successfully',
        result: comment,
    })

})