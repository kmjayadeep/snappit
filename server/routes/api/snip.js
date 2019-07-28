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

/**
 * @swagger
 *  /api/snip/:url:
 *      get:
 *          description: get snip by url
 *          parameters:
 *          - name: url
 *            description: url of the snip
 *            in: path
 *            required: true
 *            type: string
 *          produces:
 *            - application/json
 */
router.get('/:url', async (req, res) => {
    const url = req.params.url;
    try {
        const snip = await snipService.findByUrl(url);
        res.json(snip);
    } catch (error) {
        res.status(500).json(error)
    }
})

/**
 * @swagger
 *  /api/snip:
 *      post:
 *          description: save snip to database
 */
router.post('/', async (req, res) => {
    let snip = req.body;
    try {
        snip = await snipService.saveSnip(snip);
        res.json(snip);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

module.exports = router