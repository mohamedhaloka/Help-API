const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'User name is required'],
            trim: true,
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            trim: true,
            unique: [true, 'Username is unique'],
        },
        email: {
            type: String,
            required: [true, 'User email is required'],
            trim: true,
            unique: [true, 'User email is unique'],
        },
        profilePhoto: {
            type: String,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            trim: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationCodeHashed: String,
        verificationCodeExpired: Date,
        verificationCodeDone: Boolean,
        post: {
            id: { type: String },
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            createdAt: Date,
        },
        comments: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Comment",
            }
        ],
    },
    { timestamps: true },
)

const UserModel = new mongoose.model('User', UserSchema);

module.exports = UserModel;