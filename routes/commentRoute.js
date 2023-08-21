const express = require('express');

const { getAllComments, getSpecificCommentById, addComment, updateComment, deleteComment } = require('../services/commentService')
const { processToken, allowFor } = require('../services/authService.js')

const route = express.Router()

route.use(processToken, allowFor('user'));

route.route('/').get(getAllComments).post(addComment)

route.route('/:id')
    .get(getSpecificCommentById)
    .patch(updateComment)
    .delete(deleteComment);


module.exports = route;