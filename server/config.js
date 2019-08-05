const dotenv = require('dotenv');

dotenv.config();

const envConfig = {
  development: {
    dbHost: process.env.MONGO_URL || 'mongodb://localhost/snappit',
    port: process.env.PORT || 3000,
    jwtSecret: 'thisisasecret',
    jwtExpiresIn: '7d',
  },
  production: {
    dbHost: process.env.MONGO_URL,
    port: process.env.PORT || 3000,
    jwtSecret: 'qwertyuiop1234567890',
    jwtExpiresIn: '2d',
  },
};

const commonConfig = {
  maxUrlLength: 200,
};

const env = process.env.NODE_ENV || 'development';

const config = envConfig[env];

module.exports = {
  env,
  ...commonConfig,
  ...config,
};
