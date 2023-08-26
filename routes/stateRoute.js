const express = require('express');

const { getStateByCountryCode } = require('../services/stateService')
const cityRoute = require('../routes/cityRoute')

const route = express.Router({ mergeParams: true })

route.get('/', getStateByCountryCode)
route.use('/:stateCode/cities', cityRoute)

module.exports = route;