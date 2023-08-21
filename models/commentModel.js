const mongoose = require('mongoose');


const CommentSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        user: mongoose.Types.ObjectId,
        postId: String,
    },
    { timestamps: true },
)

const CommentModel = new mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;