const express = require('express');

const { updateProfileData, updateProfilePassword } = require('../services/profileService')
const { processToken, allowFor } = require('../services/authService.js')
const route = express.Router()

route.use(processToken, allowFor('user'));

route.post('/changeProfileData', updateProfileData)
route.post('/changeProfilePassword', updateProfilePassword)

module.exports = route;