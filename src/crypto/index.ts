// Symmetric Encryption
export {
  aesEncrypt,
  aesDecrypt,
  desEncrypt,
  desDecrypt,
  tripleDesEncrypt,
  tripleDesDecrypt,
  blowfishEncrypt,
  blowfishDecrypt,
  rc4Encrypt,
  rc4Decrypt,
  rabbitEncrypt,
  rabbitDecrypt,
} from './symmetric';

// Hashing
export {
  md5Hash,
  sha1Hash,
  sha256Hash,
  sha512Hash,
  sha3Hash,
  ripemd160Hash,
  hmacMD5,
  hmacSHA1,
  hmacSHA256,
  hmacSHA512,
  pbkdf2,
  evpKdf,
  hashText,
  getHashAlgorithms,
} from './hash';

// Asymmetric Encryption
export {
  generateRSAKeyPair,
  rsaEncrypt,
  rsaDecrypt,
  rsaSign,
  rsaVerify,
  generateECCKeyPair,
  eccSign,
  eccVerify,
  getECCCurves,
  getRSAKeySizes,
  type RSAKeyPair,
  type ECCKeyPair,
} from './asymmetric';

// Image Encryption
export {
  imageToBase64,
  base64ToImage,
  encryptImage,
  decryptImage,
  downloadEncryptedImage,
  downloadDecryptedImage,
  getImageAlgorithms,
} from './imageCrypto';

// Define all available encryption algorithms
export const getAllEncryptionAlgorithms = (): { 
  symmetric: string[]; 
  asymmetric: string[]; 
  hash: string[];
  image: string[];
} => {
  return {
    symmetric: [
      'AES-256-GCM',
      'AES-256-CBC',
      'AES-256-ECB',
      'AES-256-CTR',
      'DES',
      '3DES',
      'Blowfish',
      'RC4',
      'Rabbit',
    ],
    asymmetric: ['RSA-2048', 'RSA-3072', 'RSA-4096', 'ECC-secp256r1', 'ECC-secp384r1'],
    hash: ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'SHA-3', 'RIPEMD-160'],
    image: ['AES-256-GCM', 'AES', 'DES', '3DES', 'RC4', 'Rabbit'],
  };
};

// Get algorithm description
export const getAlgorithmDescription = (algorithm: string): string => {
  const descriptions: Record<string, string> = {
    'AES-256-GCM': 'Advanced Encryption Standard with 256-bit key in Galois/Counter Mode. Provides both encryption and authentication.',
    'AES-256-CBC': 'AES with Cipher Block Chaining mode. Widely used, requires unique IV for each encryption.',
    'AES-256-ECB': 'AES with Electronic Codebook mode. Not recommended for multiple blocks.',
    'AES-256-CTR': 'AES with Counter mode. Efficient for parallel encryption.',
    'DES': 'Data Encryption Standard. 56-bit key (obsolete, for educational purposes only).',
    '3DES': 'Triple DES. Applies DES three times. More secure than DES but slow.',
    'Blowfish': 'Symmetric block cipher with variable key length (32-448 bits).',
    'RC4': 'Stream cipher. Fast but has known vulnerabilities.',
    'Rabbit': 'High-speed stream cipher. Designed for software implementation.',
    'RSA-2048': 'RSA with 2048-bit key. Industry standard for asymmetric encryption.',
    'RSA-3072': 'RSA with 3072-bit key. Higher security than 2048-bit.',
    'RSA-4096': 'RSA with 4096-bit key. Maximum security, slower performance.',
    'ECC-secp256r1': 'Elliptic Curve Cryptography with NIST P-256 curve. Efficient and secure.',
    'ECC-secp384r1': 'ECC with NIST P-384 curve. Higher security level.',
    'MD5': 'Message Digest 5. 128-bit hash (obsolete for security, use for checksums only).',
    'SHA-1': 'Secure Hash Algorithm 1. 160-bit hash (being phased out).',
    'SHA-256': 'SHA-2 with 256-bit output. Industry standard for hashing.',
    'SHA-512': 'SHA-2 with 512-bit output. Higher security than SHA-256.',
    'SHA-3': 'Latest SHA family. Different design from SHA-2.',
    'RIPEMD-160': 'RIPE Message Digest. 160-bit hash, used in Bitcoin.',
  };
  
  return descriptions[algorithm] || 'No description available.';
};

// Get algorithm security level
export const getAlgorithmSecurityLevel = (algorithm: string): 'high' | 'medium' | 'low' | 'deprecated' => {
  const securityLevels: Record<string, 'high' | 'medium' | 'low' | 'deprecated'> = {
    'AES-256-GCM': 'high',
    'AES-256-CBC': 'high',
    'AES-256-ECB': 'medium',
    'AES-256-CTR': 'high',
    'DES': 'deprecated',
    '3DES': 'low',
    'Blowfish': 'medium',
    'RC4': 'deprecated',
    'Rabbit': 'medium',
    'RSA-2048': 'high',
    'RSA-3072': 'high',
    'RSA-4096': 'high',
    'ECC-secp256r1': 'high',
    'ECC-secp384r1': 'high',
    'MD5': 'deprecated',
    'SHA-1': 'deprecated',
    'SHA-256': 'high',
    'SHA-512': 'high',
    'SHA-3': 'high',
    'RIPEMD-160': 'medium',
  };
  
  return securityLevels[algorithm] || 'medium';
};
