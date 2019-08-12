const crypto = require('crypto');

/**
 * generates random string of characters i.e salt.
 * @param {number} length - Length of the random string.
 */
const genRandomString = length => crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);

/**
 * hash password with sha256.
 * @param {string} payload - Password to be hashed.
 * @param {string} salt - Random string of characters i.e salt.
 */
const sha256 = (payload, salt) => crypto.createHmac('sha256', salt).update(payload).digest('hex');

/**
 * hash password with sha256 and salt.
 * @function
 * @param {string} password - Password to be hashed along with salt value.
 */
const hashPassword = (password) => {
  const passwordSalt = genRandomString(16);
  const passwordHash = sha256(password, passwordSalt);
  return {
    passwordHash,
    passwordSalt,
  };
};

const verifyPassword = (
  password,
  passwordHash,
  passwordSalt,
) => (sha256(password, passwordSalt) === passwordHash);

module.exports = {
  hashPassword,
  verifyPassword,
};
