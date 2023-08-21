const express = require('express');

const { signUp, logIn, forgetPassword, verifyCode, resetPassword } = require('../services/authService')

const route = express.Router()


route.route('/signUp').post(signUp);
route.route('/logIn').post(logIn);
route.route('/forgetPassword').post(forgetPassword);
route.route('/verifyCode').post(verifyCode);
route.route('/resetPassword').post(resetPassword);


module.exports = route;