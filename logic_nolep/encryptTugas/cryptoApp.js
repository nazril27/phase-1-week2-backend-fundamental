const CryptoJS = require('crypto-js');

function encrypt(text, key) {
  const encrypt = CryptoJS.AES.encrypt(text, key).toString();

  return encrypt;
}

function decrypt(encryptedText, key) {
   const bytes = CryptoJS.AES.decrypt(encryptedText, key);
   const decrypt = bytes.toString(CryptoJS.enc.Utf8);

   return decrypt;
}

module.exports = { encrypt, decrypt };