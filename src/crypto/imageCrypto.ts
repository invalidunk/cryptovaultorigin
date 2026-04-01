import CryptoJS from 'crypto-js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

type EncryptedImagePayload = {
  v: 1;
  alg: string;
  salt?: string;
  iv?: string;
  mimeType: string;
  originalName: string;
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

// Convert image to base64
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert base64 to image file
export const base64ToImage = (
  base64: string,
  filename: string,
  mimeType: string = 'image/png'
): File => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
};

const deriveAesKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
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

const encryptImageGCM = async (
  file: File,
  password: string
): Promise<{ encryptedData: string; originalName: string; mimeType: string }> => {
  const base64Data = await imageToBase64(file);
  const plaintext = encoder.encode(base64Data);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(password, salt);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    plaintext
  );

  const payload: EncryptedImagePayload = {
    v: 1,
    alg: 'AES-256-GCM',
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    mimeType: file.type || 'image/png',
    originalName: file.name,
    ciphertext: bytesToBase64(new Uint8Array(encryptedBuffer)),
  };

  return {
    encryptedData: JSON.stringify(payload),
    originalName: file.name,
    mimeType: file.type || 'image/png',
  };
};

const decryptImageGCM = async (
  encryptedData: string,
  password: string
): Promise<{ dataUrl: string; originalName: string; mimeType: string }> => {
  const payload = JSON.parse(encryptedData) as EncryptedImagePayload;

  if (payload.alg !== 'AES-256-GCM') {
    throw new Error('Unsupported algorithm for AES-GCM decrypt');
  }

  if (!payload.salt || !payload.iv) {
    throw new Error('Missing salt or iv');
  }

  const salt = base64ToBytes(payload.salt);
  const iv = base64ToBytes(payload.iv);
  const ciphertext = base64ToBytes(payload.ciphertext);

  const key = await deriveAesKey(password, salt);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    key,
    ciphertext
  );

  const base64Data = decoder.decode(decryptedBuffer);

  if (!base64Data) {
    throw new Error('Invalid key or corrupted encrypted data');
  }

  return {
    dataUrl: `data:${payload.mimeType};base64,${base64Data}`,
    originalName: payload.originalName,
    mimeType: payload.mimeType,
  };
};

// Encrypt image data
export const encryptImage = async (
  file: File,
  key: string,
  algorithm: string = 'AES-256-GCM'
): Promise<{ encryptedData: string; originalName: string; mimeType: string }> => {
  try {
    switch (algorithm.toUpperCase()) {
      case 'AES-256-GCM':
        return await encryptImageGCM(file, key);

      case 'AES':
      case 'AES-256': {
        const base64Data = await imageToBase64(file);
        const paddedKey = key.padEnd(32, '0').slice(0, 32);
        const encryptedData = CryptoJS.AES.encrypt(base64Data, paddedKey).toString();
        return {
          encryptedData,
          originalName: file.name,
          mimeType: file.type,
        };
      }

      case 'DES': {
        const base64Data = await imageToBase64(file);
        const desKey = key.padEnd(8, '0').slice(0, 8);
        const encryptedData = CryptoJS.DES.encrypt(base64Data, desKey).toString();
        return {
          encryptedData,
          originalName: file.name,
          mimeType: file.type,
        };
      }

      case '3DES':
      case 'TRIPLEDES': {
        const base64Data = await imageToBase64(file);
        const tripleDesKey = key.padEnd(24, '0').slice(0, 24);
        const encryptedData = CryptoJS.TripleDES.encrypt(base64Data, tripleDesKey).toString();
        return {
          encryptedData,
          originalName: file.name,
          mimeType: file.type,
        };
      }

      case 'RC4': {
        const base64Data = await imageToBase64(file);
        const encryptedData = CryptoJS.RC4.encrypt(base64Data, key).toString();
        return {
          encryptedData,
          originalName: file.name,
          mimeType: file.type,
        };
      }

      case 'RABBIT': {
        const base64Data = await imageToBase64(file);
        const encryptedData = CryptoJS.Rabbit.encrypt(base64Data, key).toString();
        return {
          encryptedData,
          originalName: file.name,
          mimeType: file.type,
        };
      }

      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
  } catch (error) {
    throw new Error(`Image Encryption failed: ${error}`);
  }
};

// Decrypt image data
export const decryptImage = async (
  encryptedData: string,
  key: string,
  algorithm: string = 'AES-256-GCM',
  mimeType: string = 'image/png'
): Promise<string> => {
  try {
    switch (algorithm.toUpperCase()) {
      case 'AES-256-GCM': {
        const result = await decryptImageGCM(encryptedData, key);
        return result.dataUrl;
      }

      case 'AES':
      case 'AES-256': {
        const paddedKey = key.padEnd(32, '0').slice(0, 32);
        const decryptedData = CryptoJS.AES.decrypt(encryptedData, paddedKey).toString(CryptoJS.enc.Utf8);
        if (!decryptedData) throw new Error('Invalid key or corrupted encrypted data');
        return `data:${mimeType};base64,${decryptedData}`;
      }

      case 'DES': {
        const desKey = key.padEnd(8, '0').slice(0, 8);
        const decryptedData = CryptoJS.DES.decrypt(encryptedData, desKey).toString(CryptoJS.enc.Utf8);
        if (!decryptedData) throw new Error('Invalid key or corrupted encrypted data');
        return `data:${mimeType};base64,${decryptedData}`;
      }

      case '3DES':
      case 'TRIPLEDES': {
        const tripleDesKey = key.padEnd(24, '0').slice(0, 24);
        const decryptedData = CryptoJS.TripleDES.decrypt(encryptedData, tripleDesKey).toString(CryptoJS.enc.Utf8);
        if (!decryptedData) throw new Error('Invalid key or corrupted encrypted data');
        return `data:${mimeType};base64,${decryptedData}`;
      }

      case 'RC4': {
        const decryptedData = CryptoJS.RC4.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
        if (!decryptedData) throw new Error('Invalid key or corrupted encrypted data');
        return `data:${mimeType};base64,${decryptedData}`;
      }

      case 'RABBIT': {
        const decryptedData = CryptoJS.Rabbit.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
        if (!decryptedData) throw new Error('Invalid key or corrupted encrypted data');
        return `data:${mimeType};base64,${decryptedData}`;
      }

      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }
  } catch (error) {
    throw new Error(`Image Decryption failed: ${error}`);
  }
};

// Download encrypted image as file
export const downloadEncryptedImage = (
  encryptedData: string,
  originalName: string
): void => {
  const blob = new Blob([encryptedData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${originalName}.encrypted.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Download decrypted image
export const downloadDecryptedImage = (
  dataUrl: string,
  filename: string
): void => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Get supported image algorithms
export const getImageAlgorithms = (): string[] => {
  return ['AES-256-GCM', 'AES', 'DES', '3DES', 'RC4', 'Rabbit'];
};
