const asyncHandler = require('express-async-handler');
const { City } = require('country-state-city');

exports.getCityByCountryCodeAndStateCode = asyncHandler(async (req, res, next) => {

    const cities = City.getCitiesOfState(req.params.countryCode, req.params.stateCode)

    res.status(200).json({
        status: 'success',
        message: 'Fetch cities of state successfully',
        result: cities,
    })
});

