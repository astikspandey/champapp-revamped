#!/usr/bin/env node
/**
 * Cross-platform crypto compatibility test
 * Run this to verify crypto works on your system
 */

const crypto = require('crypto');
const os = require('os');

console.log('='.repeat(60));
console.log('CRYPTO COMPATIBILITY TEST');
console.log('='.repeat(60));

console.log('\n📋 System Information:');
console.log(`   Platform: ${os.platform()}`);
console.log(`   Architecture: ${os.arch()}`);
console.log(`   Node.js: ${process.version}`);
console.log(`   OS: ${os.type()} ${os.release()}`);

let allTestsPassed = true;

// Test 1: Hash creation
console.log('\n🔍 Test 1: SHA-256 Hash');
try {
  const hash = crypto.createHash('sha256').update('test').digest('hex');
  console.log(`   ✓ PASS - Hash: ${hash.substring(0, 20)}...`);
} catch (error) {
  console.error(`   ✗ FAIL - ${error.message}`);
  allTestsPassed = false;
}

// Test 2: Random bytes generation
console.log('\n🔍 Test 2: Random Bytes Generation');
try {
  const randomBytes = crypto.randomBytes(32);
  console.log(`   ✓ PASS - Generated ${randomBytes.length} bytes`);
} catch (error) {
  console.error(`   ✗ FAIL - ${error.message}`);
  allTestsPassed = false;
}

// Test 3: AES-256-CBC Encryption/Decryption
console.log('\n🔍 Test 3: AES-256-CBC Encryption');
try {
  const algorithm = 'aes-256-cbc';
  const key = crypto.createHash('sha256').update('secret_key').digest();
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update('Hello, World!', 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  if (decrypted === 'Hello, World!') {
    console.log(`   ✓ PASS - Encrypted and decrypted successfully`);
  } else {
    console.error(`   ✗ FAIL - Decryption mismatch`);
    allTestsPassed = false;
  }
} catch (error) {
  console.error(`   ✗ FAIL - ${error.message}`);
  allTestsPassed = false;
}

// Test 4: Buffer operations
console.log('\n🔍 Test 4: Buffer Operations');
try {
  const buf = Buffer.from('test', 'utf8');
  const hex = buf.toString('hex');
  const back = Buffer.from(hex, 'hex').toString('utf8');

  if (back === 'test') {
    console.log(`   ✓ PASS - Buffer conversions work`);
  } else {
    console.error(`   ✗ FAIL - Buffer conversion mismatch`);
    allTestsPassed = false;
  }
} catch (error) {
  console.error(`   ✗ FAIL - ${error.message}`);
  allTestsPassed = false;
}

console.log('\n' + '='.repeat(60));
if (allTestsPassed) {
  console.log('✅ ALL TESTS PASSED - Crypto is working correctly!');
  console.log('='.repeat(60));
  console.log('\nYour system is fully compatible with ChampApp & WalkerAuth');
  process.exit(0);
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('='.repeat(60));
  console.log('\nPossible solutions:');
  console.log('  1. Update Node.js to the latest LTS version');
  console.log('  2. Reinstall Node.js with crypto support');
  console.log('  3. Check your system\'s OpenSSL installation');
  console.log('\nFor Linux: sudo apt-get install nodejs libssl-dev');
  console.log('For macOS: brew upgrade node');
  process.exit(1);
}
