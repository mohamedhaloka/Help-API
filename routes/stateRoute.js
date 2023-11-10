const express = require('express');

const { getStateByCountryCode } = require('../services/stateService')

const route = express.Router({ mergeParams: true })

route.get('/', getStateByCountryCode)

module.exports = route;