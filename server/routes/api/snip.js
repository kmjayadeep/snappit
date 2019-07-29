const express = require('express')
const router = express.Router()
const snipService = require('../../services/snip');
const config = require('../../config');
const lockTypes = require('../../constants/lockTypes');

if (config.env == 'development')
    router.get('/', async (req, res) => {
        const snips = await snipService.getAllSnips();
        res.json(snips);
    })
else {
    router.get('/', (req, res) => {
        res.send('Snappit v1.0');
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
        if (snip.lock && snip.lock.lockType == lockTypes.TYPE_FULL) {
            if (req.auth && req.auth.passwordHash == snip.lock.password && req.auth.url == snip.url) {
                return res.json(snip);
            }
            res.status(401).json("Unauthorized to view snip");
        } else
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
 *      produces:
 *          - application/json
 */
router.post('/', async (req, res) => {
    const { body: snip, auth } = req;
    try {
        const oldSnip = await snipService.findByUrl(snip.url);
        if (oldSnip && oldSnip.lock && oldSnip.lock.lockType != lockTypes.TYPE_NONE) {
            if (!auth)
                return res.status(401).json("Auth header missing");
            if (auth.url != snip.url || auth.passwordHash != oldSnip.lock.password)
                return res.status(401).json("Not authorized");
        }
        const saved = await snipService.saveSnip(snip);
        res.json(saved);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

/**
 * @swagger
 *  /:url/authenticate:
 *      post:
 *          description: Authenticate with password to access a locked snip
 *          parameters:
 *          - name: url
 *            description: url of the snip
 *            in: path
 *            required: true
 *            type: string
 *      produces:
 *          - application/json
 */
router.post('/:url/authenticate', async (req, res) => {
    const { unlockPass } = req.body;
    const { url } = req.params;
    try {
        const { token, expires } = await snipService.getAuthToken(url, unlockPass);
        res.json({
            token,
            expires
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})


router.delete('/:url', async (req, res) => {
    const { url } = req.params;
    try {
        const snip = await snipService.findByUrl(url);
        if (snip && snip.lock && snip.lock.lockType == lockTypes.TYPE_FULL) {
            if (req.auth && req.auth.passwordHash == snip.lock.password && req.auth.url == snip.url) {
                const deleted = await snipService.deleteByUrl(url);
                return res.json(deleted);
            }
            res.status(401).json("Unauthorized to delete snip");
        } else {
            const deleted = await snipService.deleteByUrl(url);
            return res.json(deleted);
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router