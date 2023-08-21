const express = require('express');

const { getAllPosts, getLoggedUserPost, updateLoggedUserPost, deleteLoggedUserPost } = require('../services/postService')
const { processToken, allowFor } = require('../services/authService.js')
const route = express.Router()

route.use(processToken, allowFor('user'));

route.get('/', getAllPosts)

route.route('/loggedUserPost')
    .get(getLoggedUserPost)
    .post(updateLoggedUserPost)
    .delete(deleteLoggedUserPost);


module.exports = route;