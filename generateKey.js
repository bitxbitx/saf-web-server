const crypto = require('crypto');

// Generate two 256-bit (32-byte) random strings
const secretKey1 = crypto.randomBytes(32).toString('hex');
const secretKey2 = crypto.randomBytes(32).toString('hex');

console.log('Secret key 1:', secretKey1);
console.log('Secret key 2:', secretKey2);