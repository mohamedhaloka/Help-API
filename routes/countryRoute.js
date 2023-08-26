const express = require('express');

const { getCountries } = require('../services/countryService')
const stateRoute = require('../routes/stateRoute')

const route = express.Router()

route.get('/', getCountries)
route.use('/:countryCode/states', stateRoute)

module.exports = route;