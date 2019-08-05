const md5 = require('MD5');

// TODO change to sha1
const hashPassword = password => md5(password);

module.exports = {
  hashPassword,
};
