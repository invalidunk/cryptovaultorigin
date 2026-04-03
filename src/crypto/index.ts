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
    'AES-256-GCM':
      'Advanced Encryption Standard with a 256-bit key in true Galois/Counter Mode using Web Crypto API. Provides both encryption and integrity authentication.',
    'AES-256-CBC':
      'AES with Cipher Block Chaining mode. Widely used and requires a unique IV for each encryption.',
    'AES-256-ECB':
      'AES with Electronic Codebook mode. Not recommended for repeated or structured data.',
    'AES-256-CTR':
      'AES with Counter mode. Efficient and suitable for parallel encryption.',
    'DES':
      'Data Encryption Standard. Uses a 56-bit key and is obsolete for real security use.',
    '3DES':
      'Triple DES. Stronger than DES but outdated and slower than modern AES modes.',
    'Blowfish':
      'Legacy compatibility fallback in this app. It is not implemented as true Blowfish here.',
    'RC4':
      'Legacy stream cipher with known vulnerabilities. Not recommended for modern security use.',
    'Rabbit':
      'High-speed stream cipher designed for software implementation.',
    'RSA-2048':
      'RSA with a 2048-bit key. Common baseline for asymmetric encryption.',
    'RSA-3072':
      'RSA with a 3072-bit key. Higher security than RSA-2048.',
    'RSA-4096':
      'RSA with a 4096-bit key. Higher security with slower performance.',
    'ECC-secp256r1':
      'Elliptic Curve Cryptography using the NIST P-256 curve.',
    'ECC-secp384r1':
      'Elliptic Curve Cryptography using the NIST P-384 curve.',
    'MD5':
      '128-bit hash algorithm. Obsolete for security use and suitable only for checksums.',
    'SHA-1':
      '160-bit hash algorithm. Deprecated for security-sensitive usage.',
    'SHA-256':
      'SHA-2 hash with 256-bit output. Standard modern hashing choice.',
    'SHA-512':
      'SHA-2 hash with 512-bit output. Stronger output size than SHA-256.',
    'SHA-3':
      'Modern hash standard with a different internal design from SHA-2.',
    'RIPEMD-160':
      '160-bit hash algorithm, historically used in some blockchain systems.',
  };

  return descriptions[algorithm] || 'No description available.';
};

// Get algorithm security level
export const getAlgorithmSecurityLevel = (
  algorithm: string
): 'high' | 'medium' | 'low' | 'deprecated' => {
  const securityLevels: Record<string, 'high' | 'medium' | 'low' | 'deprecated'> = {
    'AES-256-GCM': 'high',
    'AES-256-CBC': 'high',
    'AES-256-ECB': 'medium',
    'AES-256-CTR': 'high',
    'DES': 'deprecated',
    '3DES': 'low',
    'Blowfish': 'low',
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
