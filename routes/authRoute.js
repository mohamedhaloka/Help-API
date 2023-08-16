const express = require('express');

const { signUp, logIn } = require('../services/authService')

const route = express.Router()


route.route('/signUp').post(signUp);
route.route('/logIn').post(logIn);


module.exports = route;