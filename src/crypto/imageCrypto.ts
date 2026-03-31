import CryptoJS from 'crypto-js';

// Convert image to base64
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert base64 to image file
export const base64ToImage = (base64: string, filename: string, mimeType: string = 'image/png'): File => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
};

// Encrypt image data using AES
export const encryptImage = async (
  file: File, 
  key: string, 
  algorithm: string = 'AES'
): Promise<{ encryptedData: string; originalName: string; mimeType: string }> => {
  try {
    const base64Data = await imageToBase64(file);
    const paddedKey = key.padEnd(32, '0').slice(0, 32);
    
    let encryptedData: string;
    
    switch (algorithm.toUpperCase()) {
      case 'AES':
      case 'AES-256':
      case 'AES-256-GCM':
        encryptedData = CryptoJS.AES.encrypt(base64Data, paddedKey, {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          iv: CryptoJS.lib.WordArray.random(16),
        }).toString();
        break;
      case 'DES':
        const desKey = key.padEnd(8, '0').slice(0, 8);
        encryptedData = CryptoJS.DES.encrypt(base64Data, desKey).toString();
        break;
      case '3DES':
      case 'TRIPLEDES':
        const tripleDesKey = key.padEnd(24, '0').slice(0, 24);
        encryptedData = CryptoJS.TripleDES.encrypt(base64Data, tripleDesKey).toString();
        break;
      case 'RC4':
        encryptedData = CryptoJS.RC4.encrypt(base64Data, key).toString();
        break;
      case 'RABBIT':
        encryptedData = CryptoJS.Rabbit.encrypt(base64Data, key).toString();
        break;
      default:
        encryptedData = CryptoJS.AES.encrypt(base64Data, paddedKey).toString();
    }
    
    return {
      encryptedData,
      originalName: file.name,
      mimeType: file.type,
    };
  } catch (error) {
    throw new Error(`Image Encryption failed: ${error}`);
  }
};

// Decrypt image data
export const decryptImage = (
  encryptedData: string, 
  key: string, 
  algorithm: string = 'AES',
  mimeType: string = 'image/png'
): string => {
  try {
    const paddedKey = key.padEnd(32, '0').slice(0, 32);
    
    let decryptedData: string;
    
    switch (algorithm.toUpperCase()) {
      case 'AES':
      case 'AES-256':
      case 'AES-256-GCM':
        decryptedData = CryptoJS.AES.decrypt(encryptedData, paddedKey).toString(CryptoJS.enc.Utf8);
        break;
      case 'DES':
        const desKey = key.padEnd(8, '0').slice(0, 8);
        decryptedData = CryptoJS.DES.decrypt(encryptedData, desKey).toString(CryptoJS.enc.Utf8);
        break;
      case '3DES':
      case 'TRIPLEDES':
        const tripleDesKey = key.padEnd(24, '0').slice(0, 24);
        decryptedData = CryptoJS.TripleDES.decrypt(encryptedData, tripleDesKey).toString(CryptoJS.enc.Utf8);
        break;
      case 'RC4':
        decryptedData = CryptoJS.RC4.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
        break;
      case 'RABBIT':
        decryptedData = CryptoJS.Rabbit.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);
        break;
      default:
        decryptedData = CryptoJS.AES.decrypt(encryptedData, paddedKey).toString(CryptoJS.enc.Utf8);
    }
    
    // Return data URL
    return `data:${mimeType};base64,${decryptedData}`;
  } catch (error) {
    throw new Error(`Image Decryption failed: ${error}`);
  }
};

// Download encrypted image as file
export const downloadEncryptedImage = (
  encryptedData: string, 
  originalName: string
): void => {
  const blob = new Blob([encryptedData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${originalName}.encrypted`;
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
