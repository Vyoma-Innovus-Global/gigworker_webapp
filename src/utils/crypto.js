import CryptoJS from "crypto-js";

const SECRET_KEY = "$Vyoma@123";

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (data) => {
  if (data) {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } else {
    return null
  }
};


export const createSHA256Hash = (data) => {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
};

export const compareSHA256Hash = (plainText, hashedValue) => {
  const newHash = CryptoJS.SHA256(plainText).toString(CryptoJS.enc.Hex);
  return newHash === hashedValue;
};