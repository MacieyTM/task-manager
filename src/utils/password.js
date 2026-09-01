const crypto = require('node:crypto');

const { promisify } = require('node:util');

const scrypt = promisify(crypto.scrypt);

const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);

  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return [salt.toString('hex'), derivedKey.toString('hex')].join(':');
}

async function verifyPassword(password, storedHash) {
  const [saltHex, hashHex] = storedHash.split(':');

  if (!saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');

  const storedKey = Buffer.from(hashHex, 'hex');

  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  if (derivedKey.length !== storedKey.length) {
    return false;
  }

  return crypto.timingSafeEqual(derivedKey, storedKey);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
