const express = require('express');

const { getAllUsers, getSpecificUserById, addNewUser, updateUser, deactivateUser } = require('../services/userService.js')
const { processToken, allowFor } = require('../services/authService')
const route = express.Router()

route.use(processToken, allowFor('admin'));

route.route('/')
    .get(getAllUsers)
    .post(addNewUser);

route.route('/:id')
    .get(getSpecificUserById)
    .patch(updateUser)
    .delete(deactivateUser);


module.exports = route;