const snipModel = require('../models/snip');
const config = require('../config')
const lockTypes = require('../constants/lockTypes');
var md5 = require('MD5')

//TODO handle lock
const findByUrl = async url => {
    try {
        return await snipModel.findByUrl();
    } catch (error) {
        console.error(error);
        throw "Unable to find snip data";
    }
}

//TODO handle lock
const deleteByUrl = async url => {
    try {
        const snip = await snipModel.findByUrl(url);
        return await snip.remove();
    } catch (error) {
        console.error(error);
        throw "Unable to delete snip";
    }
}

// TODO change md5 to sha1
const addSnip = async ({ url, note, urls, lock, unlockPass }) => {
    let snip = new snipModel({
        url,
        note: note ? note : "",
        urls: urls ? urls : [],
        created: Date.now(),
        modified: Date.now()
    });
    if (lock && lock.lockType != lockTypes.TYPE_NONE && unlockPass) {
        snip.lock = {
            lockType: snip.lock.lockType,
            password: hashPassword(unlockPass)
        }
    } else {
        snip.lock = {
            lockType: lockTypes.TYPE_NONE
        }
    }
    try {
        return await snip.save();
    } catch (error) {
        console.error(error);
        throw "Unable to add snip";
    }
}

const editSnip = async (oldSnip, newSnip) => {
    const { url, note, urls, lock, unlockPass, unlockPassNew } = newSnip;
    if (oldSnip.lock && oldSnip.lock.lockType != lockTypes.TYPE_NONE) {
        if (!unlockPass)
            throw "Cannot Modify: Read only";
        if (hashPassword(unlockPass) != snip.lock.password)
            throw "Inavlid Password";
    }
    oldSnip = {
        ...oldSnip,
        url,
        note: note ? note : "",
        urls: urls ? urls : [],
        modified: Date.now()
    };
    //Ability to change password
    unlockPass = unlockPassNew ? unlockPassNew : unlockPass;
    if (lock && lock.lockType && unlockPass) {
        oldSnip.lock = {
            lockType: lock.lockType,
            password: hashPassword(unlockPass)
        }
    } else {
        oldSnip.lock = {
            lockType: lockTypes.TYPE_NONE
        }
    }
    try {
        return await oldSnip.save();
    } catch (error) {
        console.error(error);
        throw "Unable to save snip";
    }
}

const saveSnip = async (snip) => {
    const { url } = snip;
    if (!validateUrl(url))
        throw "Invalid URL";
    if (url.length > config.maxUrlLength)
        throw "URL too long";
    let existing = await findByUrl(url);
    if (!existing)
        return addSnip(snip);
    else
        return editSnip(existing, snip);
}

const validateUrl = url => {
    if (typeof url == 'undefined' || url == null || url == "") {
        return false;
    }
    if (!url.match(/^[0-9a-zA-Z]+$/)) {
        return false;
    }
    return true;
}

const getAllSnips = () => {
    return snipModel.find({}).exec();
}

const hashPassword = password => md5(password);

module.exports = {
    findByUrl,
    deleteByUrl,
    saveSnip,
    validateUrl,
    getAllSnips
}