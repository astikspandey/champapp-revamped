/**
 * Windows-specific crypto implementation
 * Optimized for Windows systems
 */

import crypto from 'crypto';

console.log('🪟 Loading Windows crypto module...');

/**
 * Create a hash (Windows-optimized)
 */
export function createHash(algorithm: string, data: string | Buffer): Buffer {
  try {
    return crypto.createHash(algorithm).update(data).digest();
  } catch (error) {
    console.error(`❌ [Windows] Failed to create ${algorithm} hash:`, error);
    throw new Error(`Hashing failed on Windows: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate random bytes (Windows-optimized)
 */
export function randomBytes(size: number): Buffer {
  try {
    // Windows uses CryptGenRandom internally
    return crypto.randomBytes(size);
  } catch (error) {
    console.error(`❌ [Windows] Failed to generate random bytes:`, error);
    throw new Error(`Random generation failed on Windows: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create cipher (Windows-optimized)
 */
export function createCipheriv(algorithm: string, key: Buffer, iv: Buffer): crypto.Cipher {
  try {
    return crypto.createCipheriv(algorithm, key, iv);
  } catch (error) {
    console.error(`❌ [Windows] Cipher creation failed:`, error);
    throw new Error(`Cipher creation failed on Windows: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create decipher (Windows-optimized)
 */
export function createDecipheriv(algorithm: string, key: Buffer, iv: Buffer): crypto.Decipher {
  try {
    return crypto.createDecipheriv(algorithm, key, iv);
  } catch (error) {
    console.error(`❌ [Windows] Decipher creation failed:`, error);
    throw new Error(`Decipher creation failed on Windows: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a random hex token
 */
export function generateToken(bytes: number = 32): string {
  return randomBytes(bytes).toString('hex');
}

console.log('✓ Windows crypto module loaded successfully');
