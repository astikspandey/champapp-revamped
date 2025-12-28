#!/usr/bin/env node
/**
 * Build client bundle using esbuild
 */

import { build } from '../esbuild.config.js';

build().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});
