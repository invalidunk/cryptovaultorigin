export interface EncryptionAlgorithm {
  id: string;
  name: string;
  type: 'symmetric' | 'asymmetric' | 'hash';
  description: string;
  securityLevel: 'high' | 'medium' | 'low' | 'deprecated';
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface EncryptedData {
  data: string;
  algorithm: string;
  timestamp: number;
}

export interface HashResult {
  algorithm: string;
  hash: string;
  originalText: string;
}

export interface ImageEncryptionResult {
  encryptedData: string;
  originalName: string;
  mimeType: string;
  algorithm: string;
}

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'veryStrong';
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export type EncryptionMode = 'GCM' | 'CBC' | 'ECB' | 'CTR';

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512' | 'SHA-3' | 'RIPEMD-160';

export type RSAKeySize = 1024 | 2048 | 3072 | 4096;

export type ECCCurve = 'secp256r1' | 'secp384r1' | 'secp521r1' | 'secp256k1';
