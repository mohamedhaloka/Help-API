const asyncHandler = require('express-async-handler');
const { Country, State, City } = require('country-state-city');

exports.getStateByCountryCode = asyncHandler(async (req, res, next) => {

    const states = State.getStatesOfCountry(req.params.countryCode)

    res.status(200).json({
        status: 'success',
        message: 'Fetch states of country successfully',
        result: states,
    })
});

