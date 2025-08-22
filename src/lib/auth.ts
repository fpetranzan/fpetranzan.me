import bcrypt from 'bcryptjs';

export interface AdminCredentials {
  username: string;
  password: string;
}

export function getAdminCredentials(): AdminCredentials {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('Admin credentials not configured. Please set ADMIN_USERNAME and ADMIN_PASSWORD environment variables.');
  }

  return { username, password };
}

export async function verifyAdminCredentials(inputUsername: string, inputPassword: string): Promise<boolean> {
  try {
    const { username, password } = getAdminCredentials();
    
    // Check username (case insensitive)
    const usernameMatch = username.toLowerCase() === inputUsername.toLowerCase();
    
    // Check password - support both plain text and hashed passwords
    let passwordMatch = false;
    
    // If password starts with $2a$, $2b$, or $2y$, it's likely a bcrypt hash
    if (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$')) {
      passwordMatch = await bcrypt.compare(inputPassword, password);
    } else {
      // Plain text comparison (not recommended for production)
      passwordMatch = password === inputPassword;
    }
    
    return usernameMatch && passwordMatch;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

export async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(plainPassword, saltRounds);
}