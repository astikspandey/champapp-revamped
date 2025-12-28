/**
 * Linux-specific crypto implementation
 * Optimized for Linux systems with enhanced error handling
 */

import crypto from 'crypto';

console.log('🐧 Loading Linux crypto module...');

/**
 * Create a hash (Linux-optimized)
 */
export function createHash(algorithm: string, data: string | Buffer): Buffer {
  try {
    // Linux systems may have different OpenSSL configurations
    return crypto.createHash(algorithm).update(data).digest();
  } catch (error) {
    console.error(`❌ [Linux] Failed to create ${algorithm} hash:`, error);

    // Try alternative approach for older Linux systems
    try {
      const hash = crypto.createHash(algorithm);
      if (typeof data === 'string') {
        hash.update(data, 'utf8');
      } else {
        hash.update(data);
      }
      return hash.digest();
    } catch (retryError) {
      throw new Error(`Hashing failed on Linux: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Generate random bytes (Linux-optimized)
 */
export function randomBytes(size: number): Buffer {
  try {
    // Linux has /dev/urandom which is used by crypto.randomBytes
    return crypto.randomBytes(size);
  } catch (error) {
    console.error(`❌ [Linux] Failed to generate random bytes:`, error);
    throw new Error(`Random generation failed on Linux: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create cipher (Linux-optimized)
 */
export function createCipheriv(algorithm: string, key: Buffer, iv: Buffer): crypto.Cipher {
  try {
    return crypto.createCipheriv(algorithm, key, iv);
  } catch (error) {
    console.error(`❌ [Linux] Cipher creation failed:`, error);
    console.error(`   Algorithm: ${algorithm}, Key: ${key.length} bytes, IV: ${iv.length} bytes`);
    throw new Error(`Cipher creation failed on Linux: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create decipher (Linux-optimized)
 */
export function createDecipheriv(algorithm: string, key: Buffer, iv: Buffer): crypto.Decipher {
  try {
    return crypto.createDecipheriv(algorithm, key, iv);
  } catch (error) {
    console.error(`❌ [Linux] Decipher creation failed:`, error);
    throw new Error(`Decipher creation failed on Linux: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate a random hex token
 */
export function generateToken(bytes: number = 32): string {
  return randomBytes(bytes).toString('hex');
}

console.log('✓ Linux crypto module loaded successfully');
