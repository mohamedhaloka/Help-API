const express = require('express');

const { getAllUsers, getSpecificUserById, addNewUser, updateUser, deactivateUser } = require('../services/userService.js')

const route = express.Router()


route.route('/')
    .get(getAllUsers)
    .post(addNewUser);

route.route('/:id')
    .get(getSpecificUserById)
    .patch(updateUser)
    .delete(deactivateUser);


module.exports = route;