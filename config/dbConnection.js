const mongoose = require('mongoose')


const dbConnection = () => {
    const dbUrl = process.env.DB_URL;
    mongoose.connect(dbUrl)
        .then(() => console.log('DB Connected!'))
        .catch((e) => console.log(`Error while connecting ${e}`));
}

module.exports = dbConnection;