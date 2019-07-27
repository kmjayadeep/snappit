const express = require('express')
const router = express.Router()
const snipService = require('../../services/snip');
const config = require('../../config');

if (config.env == 'development')
    router.get('/', async (req, res) => {
        const snips = await snipService.getAllSnips();
        res.json(snips);
    })
else {
    router.get('/', (req, res) => {
        res.send('hello world');
    })
}

module.exports = router