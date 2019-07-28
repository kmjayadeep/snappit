const md5 = require('MD5');

const hashPassword = password => md5(password);

module.exports = {
    hashPassword
}