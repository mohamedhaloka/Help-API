const asyncHandler = require('express-async-handler');
const { Country, State, City } = require('country-state-city');


exports.getCountries = asyncHandler(async (req, res, next) => {

    const countries = Country.getAllCountries()

    res.status(200).json({
        status: 'success',
        message: 'Fetch countries successfully',
        result: countries,
    })
});