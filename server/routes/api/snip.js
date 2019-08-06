const express = require('express');

const router = express.Router();
const snipService = require('../../services/snip');
const config = require('../../config');
const lockTypes = require('../../constants/lockTypes');

if (config.env === 'development') {
  router.get('/', async (req, res) => {
    const snips = await snipService.getAllSnips();
    res.json(snips);
  });
} else {
  router.get('/', (req, res) => {
    res.send('Snappit v1.0');
  });
}


/**
 * @swagger
 * definitions:
 *   snip:
 *     properties:
 *       url:
 *         type: string
 *       note:
 *         type: string
 *       urls:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             label:
 *                type: string
 *             link:
 *                type: string
 *       lock:
 *         type: object
 *         properties:
 *           lockType:
 *             type: string
 *             enum: [none, full, readonly]
 */


/**
 * @swagger
 *  /api/snip/{url}:
 *      get:
 *          tags:
 *          - snip
 *          description: get snip by url
 *          parameters:
 *          - name: url
 *            description: url of the snip
 *            in: path
 *            required: true
 *            type: string
 *          produces:
 *            - application/json
 *          responses:
 *            200:
 *              description: Get the snip corresponds to provided URL
 *              schema:
 *                $ref: '#/definitions/snip'
 */
router.get('/:url', async (req, res) => {
  const { url } = req.params;
  try {
    const snip = await snipService.findByUrl(url);
    if (snip && snip.lock && snip.lock.lockType === lockTypes.TYPE_FULL) {
      if (req.auth && req.auth.passwordHash === snip.lock.password && req.auth.url === snip.url) {
        return res.json(snip);
      }
      return res.status(401).json('Unauthorized to view snip');
    }
    return res.json(snip);
  } catch (error) {
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 *  /api/snip:
 *      post:
 *          tags:
 *          - snip
 *          description: save or edit snip
 *          parameters:
 *          - name: puppy
 *            description: Snip to be saved
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/snip'
 *          produces:
 *            - application/json
 *          responses:
 *            200:
 *              description: Returns the saved snip
 *              schema:
 *                $ref: '#/definitions/snip'
 */
router.post('/', async (req, res) => {
  const { body: snip, auth } = req;
  try {
    const oldSnip = await snipService.findByUrl(snip.url);
    if (oldSnip && oldSnip.lock && oldSnip.lock.lockType !== lockTypes.TYPE_NONE) {
      if (!auth) {
        return res.status(401).json('Auth header missing');
      }
      if (auth.url !== snip.url || auth.passwordHash !== oldSnip.lock.password) {
        return res.status(401).json('Not authorized');
      }
    }
    const saved = await snipService.saveSnip(snip);
    return res.json(saved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

/**
 * @swagger
 *  /api/snip/{url}/authenticate:
 *      post:
 *          tags:
 *          - snip
 *          description: Authenticate with password to access a locked snip
 *          parameters:
 *          - name: url
 *            description: Snip url to access
 *            in: path
 *            type: string
 *            required: true
 *          - name: unlockPass
 *            description: Password to unlock snip
 *            in: body
 *            type: string
 *            required: true
 *          produces:
 *            - application/json
 *          responses:
 *            200:
 *              description: Returns token and expire date which should be used to access the snip
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                  expires:
 *                    type: number
 *            401:
 *               description: Invalid url or password
 */
router.post('/:url/authenticate', async (req, res) => {
  const { unlockPass } = req.body;
  const { url } = req.params;
  try {
    const { token, expires } = await snipService.getAuthToken(url, unlockPass);
    res.json({
      token,
      expires,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

/**
 * @swagger
 *  /api/snip/{url}:
 *      delete:
 *          tags:
 *          - snip
 *          description: Delete snip by url
 *          parameters:
 *          - name: url
 *            description: url of the snip
 *            in: path
 *            required: true
 *            type: string
 *          produces:
 *            - application/json
 *          responses:
 *            200:
 *              description: Returns the snip which got deleted
 *              schema:
 *                $ref: '#/definitions/snip'
 */
router.delete('/:url', async (req, res) => {
  const { url } = req.params;
  try {
    const snip = await snipService.findByUrl(url);
    if (snip && snip.lock && snip.lock.lockType === lockTypes.TYPE_FULL) {
      if (req.auth && req.auth.passwordHash === snip.lock.password && req.auth.url === snip.url) {
        const deleted = await snipService.deleteByUrl(url);
        return res.json(deleted);
      }
      return res.status(401).json('Unauthorized to delete snip');
    }
    const deleted = await snipService.deleteByUrl(url);
    return res.json(deleted);
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;
