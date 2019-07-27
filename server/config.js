const dotenv = require('dotenv');
dotenv.config();

const envConfig = {
    development: {
        dbHost: process.env.MONGO_URL || 'mongodb://localhost/snappit',
        port: process.env.PORT || 3000
    },
    production: {
        dbHost: process.env.MONGO_URL,
        port: process.env.PORT || 3000
    }
}

const commonConfig = {
    maxUrlLength: 200
}

const env = process.env.NODE_ENV || 'development';

var config = envConfig[env];

module.exports = {
    env,
    ...commonConfig,
    ...config
}