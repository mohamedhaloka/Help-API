const express = require('express');

const { getCityByCountryCodeAndStateCode } = require('../services/cityService')

const route = express.Router({ mergeParams: true })

route.get('/', getCityByCountryCodeAndStateCode)

module.exports = route;