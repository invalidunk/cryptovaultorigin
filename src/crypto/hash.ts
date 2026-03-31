import CryptoJS from 'crypto-js';

// MD5 Hash
export const md5Hash = (text: string): string => {
  return CryptoJS.MD5(text).toString();
};

// SHA-1 Hash
export const sha1Hash = (text: string): string => {
  return CryptoJS.SHA1(text).toString();
};

// SHA-256 Hash
export const sha256Hash = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

// SHA-512 Hash
export const sha512Hash = (text: string): string => {
  return CryptoJS.SHA512(text).toString();
};

// SHA-3 Hash
export const sha3Hash = (text: string, outputLength: number = 256): string => {
  return CryptoJS.SHA3(text, { outputLength }).toString();
};

// RIPEMD-160 Hash
export const ripemd160Hash = (text: string): string => {
  return CryptoJS.RIPEMD160(text).toString();
};

// HMAC with various algorithms
export const hmacMD5 = (text: string, key: string): string => {
  return CryptoJS.HmacMD5(text, key).toString();
};

export const hmacSHA1 = (text: string, key: string): string => {
  return CryptoJS.HmacSHA1(text, key).toString();
};

export const hmacSHA256 = (text: string, key: string): string => {
  return CryptoJS.HmacSHA256(text, key).toString();
};

export const hmacSHA512 = (text: string, key: string): string => {
  return CryptoJS.HmacSHA512(text, key).toString();
};

// PBKDF2 Key Derivation
export const pbkdf2 = (
  text: string, 
  salt: string, 
  keySize: number = 256/32, 
  iterations: number = 1000
): string => {
  return CryptoJS.PBKDF2(text, salt, {
    keySize,
    iterations,
  }).toString();
};

// EvpKDF Key Derivation
export const evpKdf = (
  text: string, 
  salt: string, 
  keySize: number = 256/32, 
  iterations: number = 1
): string => {
  return CryptoJS.EvpKDF(text, salt, {
    keySize,
    iterations,
  }).toString();
};

// Generic hash function selector
export const hashText = (text: string, algorithm: string): string => {
  switch (algorithm.toUpperCase()) {
    case 'MD5':
      return md5Hash(text);
    case 'SHA1':
    case 'SHA-1':
      return sha1Hash(text);
    case 'SHA256':
    case 'SHA-256':
      return sha256Hash(text);
    case 'SHA512':
    case 'SHA-512':
      return sha512Hash(text);
    case 'SHA3':
    case 'SHA-3':
      return sha3Hash(text);
    case 'RIPEMD160':
    case 'RIPEMD-160':
      return ripemd160Hash(text);
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`);
  }
};

// Get all available hash algorithms
export const getHashAlgorithms = (): string[] => {
  return ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'SHA-3', 'RIPEMD-160'];
};
