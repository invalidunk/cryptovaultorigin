import CryptoJS from 'crypto-js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

type AesGcmPayload = {
  v: 1;
  alg: 'AES-256-GCM';
  salt: string;
  iv: string;
  ciphertext: string;
};

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
};

const base64ToBytes = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  return Uint8Array.from(bytes).buffer as ArrayBuffer;
};

const encodePayload = (payload: AesGcmPayload): string => {
  return btoa(JSON.stringify(payload));
};

const decodePayload = (encoded: string): AesGcmPayload => {
  try {
    return JSON.parse(atob(encoded)) as AesGcmPayload;
  } catch {
    return JSON.parse(encoded) as AesGcmPayload;
  }
};

const deriveAesKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const passwordBytes = encoder.encode(password);

  const baseKey = await crypto.subtle.importKey(
    'raw',
    toArrayBuffer(passwordBytes),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations: 250000,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
};

const aesGcmEncrypt = async (text: string, password: string): Promise<string> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(password, salt);
  const plaintext = encoder.encode(text);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(iv),
      tagLength: 128,
    },
    key,
    toArrayBuffer(plaintext)
  );

  const payload: AesGcmPayload = {
    v: 1,
    alg: 'AES-256-GCM',
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(encryptedBuffer)),
  };

  return encodePayload(payload);
};

const aesGcmDecrypt = async (encryptedText: string, password: string): Promise<string> => {
  const payload = decodePayload(encryptedText);

  if (payload.alg !== 'AES-256-GCM') {
    throw new Error('Unsupported AES-GCM payload');
  }

  const salt = base64ToBytes(payload.salt);
  const iv = base64ToBytes(payload.iv);
  const ciphertext = base64ToBytes(payload.ciphertext);

  const key = await deriveAesKey(password, salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: toArrayBuffer(iv),
      tagLength: 128,
    },
    key,
    toArrayBuffer(ciphertext)
  );

  return decoder.decode(decryptedBuffer);
};

export const aesEncrypt = async (
  text: string,
  key: string,
  mode: string = 'CBC'
): Promise<string> => {
  try {
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
        return await aesGcmEncrypt(text, key);

      default:
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

export const aesDecrypt = async (
  encryptedText: string,
  key: string,
  mode: string = 'CBC'
): Promise<string> => {
  try {
    const paddedKey = key.padEnd(32, '0').slice(0, 32);

    switch (mode.toUpperCase()) {
      case 'GCM':
        return await aesGcmDecrypt(encryptedText, key);

      case 'CBC':
      case 'ECB':
      case 'CTR':
      default: {
        const decrypted = CryptoJS.AES.decrypt(encryptedText, paddedKey);
        return decrypted.toString(CryptoJS.enc.Utf8);
      }
    }
  } catch (error) {
    throw new Error(`AES Decryption failed: ${error}`);
  }
};

// DES
export const desEncrypt = (text: string, key: string): string => {
  try {
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

// 3DES
export const tripleDesEncrypt = (text: string, key: string): string => {
  try {
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
