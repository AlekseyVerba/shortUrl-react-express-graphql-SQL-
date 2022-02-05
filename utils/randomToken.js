// const crypto = require('crypto');

// function generateToken({ stringBase = 'base64', byteLength = 48 } = {}) {
//   return new Promise((resolve, reject) => {
//     crypto.randomBytes(byteLength, (err, buffer) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(buffer.toString(stringBase));
//       }
//     });
//   });
// }

// module.exports = generateToken