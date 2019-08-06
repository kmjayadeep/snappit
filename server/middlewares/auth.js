const jwt = require('jsonwebtoken');
const config = require('../config');

const authHeader = (req, res, next) => {
  const token = req.headers['x-auth-token'] || req.body.token;
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, payload) => {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          return res.status(401).json({
            message: 'Access token expired',
          });
        }
        return res.status(401).json({
          message: 'invalid Access token',
        });
      }
      req.auth = payload;
      return next();
    });
  } else {
    next();
  }
};

const signJwt = (payload) => {
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  const payloadData = jwt.verify(token, config.jwtSecret);
  const expires = payloadData.exp * 1000; // convert to millis
  return { token, expires };
};

module.exports = {
  authHeader,
  signJwt,
};
