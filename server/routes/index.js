var express = require('express')
var router = express.Router()
var snipModel = require('../models/snip')

router.post('/save', function(req, res) {
    var url = req.body.url;
    if (!url)
        return res.send({
            code: 1,
            message: 'No url'
        })
    console.log(req.body)
    snipModel.findByUrl(url, function(err, snip) {
        if (err)
            return ree.send({
                code: 2,
                message: err
            })
        if (!snip)
            snip = new snipModel(req.body)
        else {
            snip.note = req.body.note
        }
        if (!snip.note && snip._id) {
            snipModel.remove({
                _id: snip._id
            }, function(err) {
                if (err)
                    return res.send({
                        code: 2,
                        message: err
                    })
                res.send({
                    code: 0,
                    message: "Deleted Successfully"
                })
            })
        } else
            snip.save(function(err, snip) {
                if (err)
                    return res.send({
                        code: 2,
                        message: err
                    })
                res.send({
                    code: 0,
                    message: "Saved Successfully"
                })
            })
    })
});

//only when developing..remove later
if (express().get('env') == 'development')
    router.get('/viewall', function(req, res) {
        snipModel.find({}, function(err, s) {
            res.json(s)
        })
    })

router.use(function(req, res, next) {
    var url = req.url;
    if (req.method != 'GET')
        return res.send('Access Denied')
    snipModel.findByUrl(url, function(err, snip) {
        if (err)
            return res.send('Something went wrong')
        res.render('snip', {
            isNew: snip == null,
            snip: snip || {
                url: url
            }
        })
    })
})

module.exports = router
