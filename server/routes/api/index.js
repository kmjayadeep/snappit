const express = require('express')
const router = express.Router()
const snipApi = require('./snip');

router.use('/snip', snipApi);

module.exports = router