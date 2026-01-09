/**
 * Platform Detection and Router
 * Automatically detects OS and loads platform-specific code
 */

import os from 'os';
import path from 'path';

export type Platform = 'windows' | 'macos' | 'linux' | 'unknown';

/**
 * Detect the current operating system
 */
export function detectPlatform(): Platform {
  const platform = os.platform();

  switch (platform) {
    case 'win32':
      return 'windows';
    case 'darwin':
      return 'macos';
    case 'linux':
      return 'linux';
    default:
      return 'unknown';
  }
}

/**
 * Get platform-specific module path
 */
export function getPlatformPath(module: string): string {
  const platform = detectPlatform();
  return path.join(process.cwd(), 'server', 'platforms', platform, module);
}

/**
 * Display platform information
 */
export function logPlatformInfo() {
  const platform = detectPlatform();
  const nodeVersion = process.version;
  const arch = os.arch();
  const osType = os.type();
  const osRelease = os.release();

  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║          PLATFORM DETECTION                        ║');
  console.log('╠════════════════════════════════════════════════════╣');
  console.log(`║ Platform:     ${platform.toUpperCase().padEnd(36)} ║`);
  console.log(`║ OS Type:      ${osType.padEnd(36)} ║`);
  console.log(`║ OS Release:   ${osRelease.padEnd(36)} ║`);
  console.log(`║ Architecture: ${arch.padEnd(36)} ║`);
  console.log(`║ Node.js:      ${nodeVersion.padEnd(36)} ║`);
  console.log('╚════════════════════════════════════════════════════╝');

  if (platform === 'unknown') {
    console.error('\n⚠️  WARNING: Unsupported platform detected!');
    console.error('   This application supports: Windows, macOS, and Linux');
    console.error('   Attempting to continue with generic code...\n');
  } else {
    console.log(`\n✅ Using ${platform.toUpperCase()}-optimized code path\n`);
  }
}

/**
 * Load platform-specific module
 */
export async function loadPlatformModule<T>(moduleName: string): Promise<T> {
  const platform = detectPlatform();

  try {
    const modulePath = getPlatformPath(moduleName);
    const module = await import(modulePath);
    console.log(`✓ Loaded ${platform}/${moduleName}`);
    return module.default || module;
  } catch (error) {
    console.warn(`⚠️  Platform-specific module not found: ${platform}/${moduleName}`);
    console.log(`   Falling back to generic implementation...`);

    // Fallback to generic module
    try {
      const genericPath = path.join(process.cwd(), 'server', moduleName);
      const module = await import(genericPath);
      console.log(`✓ Loaded generic ${moduleName}`);
      return module.default || module;
    } catch (fallbackError) {
      console.error(`❌ Failed to load module: ${moduleName}`);
      throw fallbackError;
    }
  }
}

export const currentPlatform = detectPlatform();
