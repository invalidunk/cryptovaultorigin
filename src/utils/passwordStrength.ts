export interface PasswordStrength {
  score: number;
  level: 'weak' | 'medium' | 'strong' | 'veryStrong';
  message: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    specialChars: boolean;
  };
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  let score = 0;
  if (requirements.length) score++;
  if (requirements.uppercase) score++;
  if (requirements.lowercase) score++;
  if (requirements.numbers) score++;
  if (requirements.specialChars) score++;

  // Additional points for extra length
  if (password.length >= 16) score++;
  if (password.length >= 20) score++;

  let level: 'weak' | 'medium' | 'strong' | 'veryStrong';
  let message: string;

  if (score <= 2) {
    level = 'weak';
    message = 'weak';
  } else if (score <= 4) {
    level = 'medium';
    message = 'medium';
  } else if (score <= 5) {
    level = 'strong';
    message = 'strong';
  } else {
    level = 'veryStrong';
    message = 'veryStrong';
  }

  return {
    score,
    level,
    message,
    requirements,
  };
};

export const getPasswordStrengthColor = (level: string): string => {
  switch (level) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-green-500';
    case 'veryStrong':
      return 'bg-emerald-600';
    default:
      return 'bg-gray-300';
  }
};

export const getPasswordStrengthTextColor = (level: string): string => {
  switch (level) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-green-500';
    case 'veryStrong':
      return 'text-emerald-600';
    default:
      return 'text-gray-500';
  }
};

export const generateStrongPassword = (length: number = 16): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + specialChars;
  let password = '';
  
  // Ensure at least one of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];
  
  // Fill the rest
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
