var express = require('express')
var router = express.Router()
var snipModel = require('../models/snip')
var md5 = require('MD5')
const lockTypes = require('../constants/lockTypes');

/**
 * @swagger
 *  /save:
 *      post:
 *          description: save snip to database
 */
router.post('/save', async (req, res) => {
    const url = req.body.url;
    if (!url)
        return res.send({
            code: 1,
            message: 'No url'
        });
    console.log(req.body);
    try {
        const { note, urls, lock, unlockPass } = req.body;
        let snip = await snipModel.findByUrl(url);
        if (!snip) {
            snip = new snipModel({
                url,
                note,
                urls: urls ? urls : []
            });
        } else {
            snip.note = note;
            snip.urls = urls ? urls : [];
            if (snip.lock && snip.lock.lockType != 'none') {
                if (!unlockPass)
                    return res.json({
                        code: 4,
                        message: "Cannot Modify: Read only"
                    })
                if (md5(unlockPass) != snip.lock.password)
                    return res.status(401).json({
                        code: 3,
                        message: "Invalid Password"
                    })
            }
        }
        if (lock) {
            snip.lock = lock;
            if (snip.lock.lockType != lockTypes.TYPE_NONE)
                if (snip.lock.password)
                    snip.lock.password = md5(snip.lock.password);
                else
                    snip.lock.lockType = lockTypes.TYPE_NONE;
        }
        snip.modified = new Date();
        let saved = await snip.save();
        if (saved) {
            return res.json({
                code: 0,
                message: "Saved Successfully"
            });
        } else {
            return res.status(400).json({
                code: 2,
                message: err
            })
        }
    } catch (err) {
        console.error(err);
        return res.send({
            code: 2,
            message: err
        });
    }
});



router.get('/delete/:url', function (req, res) {
    snipModel.findByUrl('/' + req.params.url, function (err, snip) {
        if (snip) {
            snip.remove(function (err) {
                res.redirect('/')
            })
        } else {
            res.redirect('/')
        }
    })
})

//only when developing..remove later
if (express().get('env') == 'development')
    router.get('/viewall', function (req, res) {
        snipModel.find({}, function (err, s) {
            res.json(s)
        })
    })

router.use(async (req, res) => {
    var url = req.url.slice(1);
    if (req.method != 'GET') {
        return res.send('Access Denied');
    }
    try {
        let snip = await snipModel.findByUrl(url);
        snip = snip || {
            url: url,
            lock: {
                lockType: 'none'
            }
        };
        var baseUrl = req.headers.host
        url = 'http://' + baseUrl + '/' + snip.url
        res.render('snip', {
            baseUrl: baseUrl,
            isNew: snip == null,
            snip: snip,
            url: url
        })
    } catch (error) {
        return res.send('Something went wrong')
    }
})

module.exports = router
