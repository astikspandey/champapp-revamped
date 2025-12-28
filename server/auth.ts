import crypto from 'crypto';

interface WalkerAuthUserData {
  postid: string;
  email: string;
  username: string;
  profilePictureUrl: string;
}

/**
 * Decrypts WalkerAuth encrypted user data
 * @param encrypted - Hex-encoded encrypted data
 * @param iv - Hex-encoded initialization vector
 * @param secretKey - Secret key for decryption
 * @returns Decrypted user data
 */
export function decryptWalkerAuthData(
  encrypted: string,
  iv: string,
  secretKey: string
): WalkerAuthUserData {
  try {
    const algorithm = 'aes-256-cbc';

    // Hash the secret key to get 32 bytes for AES-256
    const key = crypto.createHash('sha256').update(secretKey).digest();

    // Convert IV from hex to buffer
    const ivBuffer = Buffer.from(iv, 'hex');

    // Create decipher
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);

    // Decrypt the data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Parse and return the JSON data
    return JSON.parse(decrypted) as WalkerAuthUserData;
  } catch (error) {
    console.error('Failed to decrypt WalkerAuth data:', error);
    throw new Error('Decryption failed');
  }
}

/**
 * Generates a random token for session management
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
