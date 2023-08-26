const express = require('express');

const { getAllPosts, getLoggedUserPost, updateLoggedUserPost, deleteLoggedUserPost, addLike } = require('../services/postService')
const { processToken, allowFor } = require('../services/authService.js')
const route = express.Router()

route.use(processToken, allowFor('user'));

route.get('/', getAllPosts)

route.get('/addLike/:id/', addLike)

route.route('/loggedUserPost')
    .get(getLoggedUserPost)
    .post(updateLoggedUserPost)
    .delete(deleteLoggedUserPost);


module.exports = route;