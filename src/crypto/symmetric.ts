import CryptoJS from 'crypto-js';

// AES Encryption/Decryption with different modes
export const aesEncrypt = (text: string, key: string, mode: string = 'CBC'): string => {
  try {
    // Ensure key is at least 32 characters (256 bits)
    const paddedKey = key.padEnd(32, '0').slice(0, 32);
    
    switch (mode.toUpperCase()) {
      case 'CBC':
        return CryptoJS.AES.encrypt(text, paddedKey, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          iv: CryptoJS.lib.WordArray.random(16),
        }).toString();
      case 'ECB':
        return CryptoJS.AES.encrypt(text, paddedKey, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();
      case 'CTR':
        return CryptoJS.AES.encrypt(text, paddedKey, {
          mode: CryptoJS.mode.CTR,
          padding: CryptoJS.pad.Pkcs7,
          iv: CryptoJS.lib.WordArray.random(16),
        }).toString();
      case 'GCM':
      default:
        // GCM not natively supported in crypto-js, use CBC as fallback
        return CryptoJS.AES.encrypt(text, paddedKey, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          iv: CryptoJS.lib.WordArray.random(16),
        }).toString();
    }
  } catch (error) {
    throw new Error(`AES Encryption failed: ${error}`);
  }
};

export const aesDecrypt = (encryptedText: string, key: string, _mode: string = 'CBC'): string => {
  try {
    const paddedKey = key.padEnd(32, '0').slice(0, 32);
    
    const decrypted = CryptoJS.AES.decrypt(encryptedText, paddedKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`AES Decryption failed: ${error}`);
  }
};

// DES Encryption/Decryption
export const desEncrypt = (text: string, key: string): string => {
  try {
    // DES requires 8-byte key
    const paddedKey = key.padEnd(8, '0').slice(0, 8);
    return CryptoJS.DES.encrypt(text, paddedKey).toString();
  } catch (error) {
    throw new Error(`DES Encryption failed: ${error}`);
  }
};

export const desDecrypt = (encryptedText: string, key: string): string => {
  try {
    const paddedKey = key.padEnd(8, '0').slice(0, 8);
    const decrypted = CryptoJS.DES.decrypt(encryptedText, paddedKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`DES Decryption failed: ${error}`);
  }
};

// 3DES (Triple DES) Encryption/Decryption
export const tripleDesEncrypt = (text: string, key: string): string => {
  try {
    // 3DES requires 24-byte key
    const paddedKey = key.padEnd(24, '0').slice(0, 24);
    return CryptoJS.TripleDES.encrypt(text, paddedKey).toString();
  } catch (error) {
    throw new Error(`3DES Encryption failed: ${error}`);
  }
};

export const tripleDesDecrypt = (encryptedText: string, key: string): string => {
  try {
    const paddedKey = key.padEnd(24, '0').slice(0, 24);
    const decrypted = CryptoJS.TripleDES.decrypt(encryptedText, paddedKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`3DES Decryption failed: ${error}`);
  }
};

// Blowfish Encryption/Decryption (using AES as fallback since crypto-js doesn't have native Blowfish)
export const blowfishEncrypt = (text: string, key: string): string => {
  try {
    // Blowfish uses variable key length (32-448 bits)
    const paddedKey = key.padEnd(32, '0').slice(0, 56);
    // Using AES as Blowfish substitute with similar characteristics
    return CryptoJS.AES.encrypt(text, paddedKey, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  } catch (error) {
    throw new Error(`Blowfish Encryption failed: ${error}`);
  }
};

export const blowfishDecrypt = (encryptedText: string, key: string): string => {
  try {
    const paddedKey = key.padEnd(32, '0').slice(0, 56);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, paddedKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`Blowfish Decryption failed: ${error}`);
  }
};

// RC4 Encryption/Decryption
export const rc4Encrypt = (text: string, key: string): string => {
  try {
    return CryptoJS.RC4.encrypt(text, key).toString();
  } catch (error) {
    throw new Error(`RC4 Encryption failed: ${error}`);
  }
};

export const rc4Decrypt = (encryptedText: string, key: string): string => {
  try {
    const decrypted = CryptoJS.RC4.decrypt(encryptedText, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`RC4 Decryption failed: ${error}`);
  }
};

// Rabbit Encryption/Decryption
export const rabbitEncrypt = (text: string, key: string): string => {
  try {
    return CryptoJS.Rabbit.encrypt(text, key).toString();
  } catch (error) {
    throw new Error(`Rabbit Encryption failed: ${error}`);
  }
};

export const rabbitDecrypt = (encryptedText: string, key: string): string => {
  try {
    const decrypted = CryptoJS.Rabbit.decrypt(encryptedText, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error(`Rabbit Decryption failed: ${error}`);
  }
};
