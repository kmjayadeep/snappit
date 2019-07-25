const mongoose = require('mongoose')
const lockTypes = require('../constants/lockTypes');

const snipSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    note: String,
    urls: [{
        label: String,
        link: String,
    }],
    modified: {
        type: String,
        required: true
    },
    lock: {
        lockType: {
            type: String,
            enum: [
                lockTypes.TYPE_NONE,
                lockTypes.TYPE_FULL,
                lockTypes.TYPE_READONLY
            ],
            default: 'none'
        },
        password: String
    }
})


snipSchema.index({
    url: true
}, { unique: true })

snipSchema.statics.findByUrl = function(url){
    return this.findOne({
        url: url
    }).exec();
}

const snip = mongoose.model('snip', snipSchema)

module.exports = snip
