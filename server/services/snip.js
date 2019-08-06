const SnipModel = require('../models/snip');
const config = require('../config');
const lockTypes = require('../constants/lockTypes');
const { hashPassword } = require('../utils/password');
const authMiddleWare = require('../middlewares/auth');

const validateUrl = (url) => {
  if (typeof url === 'undefined' || url === null || url === '') {
    return false;
  }
  if (!url.match(/^[0-9a-zA-Z]+$/)) {
    return false;
  }
  return true;
};

// TODO handle lock
const findByUrl = async (url) => {
  try {
    return await SnipModel.findByUrl(url);
  } catch (error) {
    console.error(error);
    throw new Error('Unable to find snip data');
  }
};

const deleteByUrl = async (url) => {
  try {
    const snip = await SnipModel.findByUrl(url);
    if (snip) return await snip.remove();
    return {};
  } catch (error) {
    console.error(error);
    throw new Error('Unable to delete snip');
  }
};

const addSnip = async ({
  url, note, urls, lock,
}) => {
  const snip = new SnipModel({
    url,
    note: note || '',
    urls: urls || [],
    created: Date.now(),
    modified: Date.now(),
  });
  if (lock && lock.lockType !== lockTypes.TYPE_NONE && lock.password) {
    snip.lock = {
      lockType: snip.lock.lockType,
      password: hashPassword(lock.password),
    };
  } else {
    snip.lock = {
      lockType: lockTypes.TYPE_NONE,
    };
  }
  try {
    return await snip.save();
  } catch (error) {
    console.error(error);
    throw new Error('Unable to add snip');
  }
};

const editSnip = async (oldSnip, newSnip) => {
  const {
    url, note, urls, lock,
  } = newSnip;
  const snipData = oldSnip;
  snipData.url = url;
  snipData.note = note || '';
  snipData.urls = urls || [];
  snipData.modified = Date.now();
  if (lock && lock.lockType && lock.password) {
    snipData.lock = {
      lockType: lock.lockType,
      password: hashPassword(lock.password),
    };
  } else {
    snipData.lock = {
      lockType: lockTypes.TYPE_NONE,
    };
  }

  try {
    return await oldSnip.save();
  } catch (error) {
    console.error(error);
    throw new Error('Unable to save snip');
  }
};

const saveSnip = async (snip) => {
  const { url } = snip;
  if (!validateUrl(url)) throw new Error('Invalid URL');
  if (url.length > config.maxUrlLength) throw new Error('URL too long');
  const existing = await findByUrl(url);
  if (!existing) return addSnip(snip);
  return editSnip(existing, snip);
};

const getAuthToken = async (url, unlockPass) => {
  const snip = await findByUrl(url);
  if (snip.lock.lockType === lockTypes.TYPE_NONE) {
    throw new Error('Snip has no lock');
  }
  if (hashPassword(unlockPass) === snip.lock.password) {
    const payload = {
      url,
      passwordHash: snip.lock.password,
    };
    const { token, expires } = authMiddleWare.signJwt(payload);
    return { token, expires };
  }
  throw new Error('Invalid Password');
};

const getAllSnips = () => SnipModel.find({}).exec();

module.exports = {
  findByUrl,
  deleteByUrl,
  saveSnip,
  validateUrl,
  getAllSnips,
  getAuthToken,
};
