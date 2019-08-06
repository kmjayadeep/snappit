const express = require('express');

const router = express.Router();
const snipApi = require('./snip');

if (express().get('env') == 'development') {
  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
}

router.use('/snip', snipApi);

module.exports = router;
