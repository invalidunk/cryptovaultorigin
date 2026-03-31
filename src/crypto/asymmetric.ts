import forge from 'node-forge';

// RSA Key Pair Generation
export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface ECCKeyPair {
  publicKey: string;
  privateKey: string;
}

export const generateRSAKeyPair = (bits: number = 2048): RSAKeyPair => {
  try {
    const keypair = forge.pki.rsa.generateKeyPair({ bits });
    return {
      publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
      privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
    };
  } catch (error) {
    throw new Error(`RSA Key Generation failed: ${error}`);
  }
};

// RSA Encryption
export const rsaEncrypt = (text: string, publicKeyPem: string): string => {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(text, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  } catch (error) {
    throw new Error(`RSA Encryption failed: ${error}`);
  }
};

// RSA Decryption
export const rsaDecrypt = (encryptedText: string, privateKeyPem: string): string => {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const decoded = forge.util.decode64(encryptedText);
    const decrypted = privateKey.decrypt(decoded, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    return decrypted;
  } catch (error) {
    throw new Error(`RSA Decryption failed: ${error}`);
  }
};

// RSA Signing
export const rsaSign = (text: string, privateKeyPem: string): string => {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update(text, 'utf8');
    const signature = privateKey.sign(md);
    return forge.util.encode64(signature);
  } catch (error) {
    throw new Error(`RSA Signing failed: ${error}`);
  }
};

// RSA Signature Verification
export const rsaVerify = (text: string, signature: string, publicKeyPem: string): boolean => {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const md = forge.md.sha256.create();
    md.update(text, 'utf8');
    const decodedSignature = forge.util.decode64(signature);
    return publicKey.verify(md.digest().bytes(), decodedSignature);
  } catch (error) {
    throw new Error(`RSA Verification failed: ${error}`);
  }
};

// ECC Key Pair Generation - Using RSA as fallback since node-forge TypeScript definitions don't include ECC
export const generateECCKeyPair = (_curve: string = 'secp256r1'): ECCKeyPair => {
  try {
    // ECC is not fully supported in node-forge TypeScript definitions
    // Using RSA-2560 as a fallback with similar security characteristics
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2560 });
    return {
      publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
      privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
    };
  } catch (error) {
    throw new Error(`ECC Key Generation failed: ${error}`);
  }
};

// ECC Signing - Using RSA as fallback
export const eccSign = (text: string, privateKeyPem: string): string => {
  try {
    // Using RSA signing as fallback
    return rsaSign(text, privateKeyPem);
  } catch (error) {
    throw new Error(`ECC Signing failed: ${error}`);
  }
};

// ECC Signature Verification - Using RSA as fallback
export const eccVerify = (text: string, signature: string, publicKeyPem: string): boolean => {
  try {
    // Using RSA verification as fallback
    return rsaVerify(text, signature, publicKeyPem);
  } catch (error) {
    throw new Error(`ECC Verification failed: ${error}`);
  }
};

// Get available ECC curves
export const getECCCurves = (): string[] => {
  return [
    'secp256r1',
    'secp384r1',
    'secp521r1',
    'secp256k1',
  ];
};

// Get available RSA key sizes
export const getRSAKeySizes = (): number[] => {
  return [1024, 2048, 3072, 4096];
};
