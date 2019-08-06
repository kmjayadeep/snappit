const express = require('express');

const router = express.Router();
const md5 = require('MD5');
const SnipModel = require('../models/snip');
const lockTypes = require('../constants/lockTypes');

/**
 * @swagger
 *  /save:
 *      post:
 *          description: save snip to database
 *          produces:
 *             - application/json
 *          responses:
 */
router.post('/save', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.send({
      code: 1,
      message: 'No url',
    });
  }
  console.log(req.body);
  try {
    const {
      note, urls, lock, unlockPass,
    } = req.body;
    let snip = await SnipModel.findByUrl(url);
    if (!snip) {
      snip = new SnipModel({
        url,
        note,
        urls: urls || [],
      });
    } else {
      snip.note = note;
      snip.urls = urls || [];
      if (snip.lock && snip.lock.lockType !== 'none') {
        if (!unlockPass) {
          return res.json({
            code: 4,
            message: 'Cannot Modify: Read only',
          });
        }
        if (md5(unlockPass) !== snip.lock.password) {
          return res.status(401).json({
            code: 3,
            message: 'Invalid Password',
          });
        }
      }
    }
    if (lock) {
      snip.lock = lock;
      if (snip.lock.lockType !== lockTypes.TYPE_NONE) {
        if (snip.lock.password) snip.lock.password = md5(snip.lock.password);
        else snip.lock.lockType = lockTypes.TYPE_NONE;
      }
    }
    snip.modified = new Date();
    const saved = await snip.save();
    if (saved) {
      return res.json({
        code: 0,
        message: 'Saved Successfully',
      });
    }
    return res.status(400).json({
      code: 2,
      message: 'Not Saved Successfully',
    });
  } catch (err) {
    console.error(err);
    return res.send({
      code: 2,
      message: err,
    });
  }
});

router.get('/delete/:url', (req, res) => {
  SnipModel.findByUrl(`/${req.params.url}`, (err, snip) => {
    if (snip) {
      snip.remove(() => {
        res.redirect('/');
      });
    } else {
      res.redirect('/');
    }
  });
});

// only when developing..remove later
if (express().get('env') === 'development') {
  router.get('/viewall', (req, res) => {
    SnipModel.find({}, (err, s) => {
      res.json(s);
    });
  });
}

router.use(async (req, res) => {
  let url = req.url.slice(1);
  if (req.method !== 'GET') {
    return res.send('Access Denied');
  }
  try {
    let snip = await SnipModel.findByUrl(url);
    snip = snip || {
      url,
      lock: {
        lockType: 'none',
      },
    };
    const baseUrl = req.headers.host;
    url = `http://${baseUrl}/${snip.url}`;
    return res.render('snip', {
      baseUrl,
      isNew: snip == null,
      snip,
      url,
    });
  } catch (error) {
    return res.send('Something went wrong');
  }
});

module.exports = router;
