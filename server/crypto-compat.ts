/**
 * Cross-platform crypto utilities
 * Works on Linux, macOS, Windows, and all Node.js versions
 */

import crypto from 'crypto';

/**
 * Check if crypto is available and working
 */
function testCrypto(): boolean {
  try {
    crypto.createHash('sha256').update('test').digest();
    return true;
  } catch (error) {
    console.error('Crypto module test failed:', error);
    return false;
  }
}

// Verify crypto is working on startup
if (!testCrypto()) {
  console.error('❌ Crypto module is not available or not working correctly');
  console.error('This is required for secure authentication');
  process.exit(1);
}

/**
 * Create a SHA-256 hash (cross-platform)
 */
export function createHash(algorithm: string, data: string | Buffer): Buffer {
  try {
    return crypto.createHash(algorithm).update(data).digest();
  } catch (error) {
    console.error(`Failed to create ${algorithm} hash:`, error);
    throw new Error(`Hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate random bytes (cross-platform)
 */
export function randomBytes(size: number): Buffer {
  try {
    return crypto.randomBytes(size);
  } catch (error) {
    console.error(`Failed to generate ${size} random bytes:`, error);
    throw new Error(`Random generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create cipher (cross-platform)
 */
export function createCipheriv(
  algorithm: string,
  key: Buffer,
  iv: Buffer
): crypto.Cipher {
  try {
    return crypto.createCipheriv(algorithm, key, iv);
  } catch (error) {
    console.error(`Failed to create cipher with algorithm ${algorithm}:`, error);
    throw new Error(`Cipher creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create decipher (cross-platform)
 */
export function createDecipheriv(
  algorithm: string,
  key: Buffer,
  iv: Buffer
): crypto.Decipher {
  try {
    return crypto.createDecipheriv(algorithm, key, iv);
  } catch (error) {
    console.error(`Failed to create decipher with algorithm ${algorithm}:`, error);
    throw new Error(`Decipher creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a random hex token
 */
export function generateToken(bytes: number = 32): string {
  return randomBytes(bytes).toString('hex');
}

// Log crypto availability on import
console.log('✓ Crypto module loaded and verified');
