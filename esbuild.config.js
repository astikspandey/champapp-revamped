/**
 * esbuild configuration for ChampApp
 * Replaces Vite with faster, simpler build tool
 */

import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== 'production';

export const buildOptions = {
  entryPoints: ['client/src/main.tsx'],
  bundle: true,
  outdir: 'dist/public',
  format: 'esm',
  splitting: true,
  sourcemap: isDev,
  minify: !isDev,
  target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
  conditions: ['style'],
  loader: {
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.svg': 'file',
    '.gif': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.eot': 'file',
    '.ttf': 'file',
    '.css': 'css',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  plugins: [
    {
      name: 'alias-resolver',
      setup(build) {
        const extensions = ['.tsx', '.ts', '.jsx', '.js'];

        // Helper to resolve file with extension
        const resolveWithExtension = (basePath) => {
          // Try exact path first
          for (const ext of extensions) {
            const fullPath = basePath + ext;
            if (fs.existsSync(fullPath)) {
              return fullPath;
            }
          }
          // Try as directory with index
          for (const ext of extensions) {
            const indexPath = path.join(basePath, 'index' + ext);
            if (fs.existsSync(indexPath)) {
              return indexPath;
            }
          }
          return basePath;
        };

        // Resolve @ alias to client/src
        build.onResolve({ filter: /^@\// }, args => {
          const basePath = path.resolve(__dirname, 'client/src', args.path.slice(2));
          return { path: resolveWithExtension(basePath) };
        });
        // Resolve @shared alias
        build.onResolve({ filter: /^@shared\// }, args => {
          const basePath = path.resolve(__dirname, 'shared', args.path.slice(8));
          return { path: resolveWithExtension(basePath) };
        });
        // Resolve @assets alias
        build.onResolve({ filter: /^@assets\// }, args => {
          const basePath = path.resolve(__dirname, 'attached_assets', args.path.slice(8));
          return { path: resolveWithExtension(basePath) };
        });
      },
    },
    copy({
      assets: [
        {
          from: './client/index.html',
          to: './index.html',
        },
        {
          from: './attached_assets/**/*',
          to: './assets',
        },
      ],
    }),
  ],
  jsx: 'automatic',
  jsxDev: isDev,
};

async function buildCSS() {
  console.log('🎨 Processing CSS with Tailwind...');
  try {
    const rootDir = process.cwd();
    const tailwindBin = path.resolve(rootDir, 'node_modules/.bin/tailwindcss');
    const inputPath = path.resolve(rootDir, 'client/src/index.css');
    const outputPath = path.resolve(rootDir, 'dist/public/main.css');
    const configPath = path.resolve(rootDir, 'tailwind.config.js');

    const cmd = `"${tailwindBin}" -c "${configPath}" -i "${inputPath}" -o "${outputPath}" ${isDev ? '' : '--minify'}`;
    console.log('Running:', cmd);
    execSync(cmd, { stdio: 'inherit', shell: true });
    console.log('✅ CSS processed!');
  } catch (error) {
    console.error('❌ CSS processing failed:', error);
    throw error;
  }
}

export async function build() {
  console.log('🔨 Building JS with esbuild...');
  console.log(`   Mode: ${isDev ? 'development' : 'production'}`);

  try {
    const result = await esbuild.build(buildOptions);
    console.log('✅ Client JS build complete!');
    return result;
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

export async function watch() {
  console.log('🔨 Building JS with esbuild...');
  console.log(`   Mode: ${isDev ? 'development' : 'production'}`);

  const context = await esbuild.context(buildOptions);

  // Do initial JS build
  await context.rebuild();
  console.log('✅ Initial JS build complete!');

  // Watch for JS changes with esbuild
  await context.watch();

  // Watch for CSS changes with Tailwind
  const rootDir = process.cwd();
  const tailwindBin = path.resolve(rootDir, 'node_modules/.bin/tailwindcss');
  const inputPath = path.resolve(rootDir, 'client/src/index.css');
  const outputPath = path.resolve(rootDir, 'dist/public/main.css');
  const configPath = path.resolve(rootDir, 'tailwind.config.js');
  const cssWatchCmd = `"${tailwindBin}" -c "${configPath}" -i "${inputPath}" -o "${outputPath}" --watch`;

  const { spawn } = await import('child_process');
  const cssWatch = spawn(cssWatchCmd, { shell: true, stdio: 'inherit' });

  console.log('👀 Watching for changes...');

  return { context, cssWatch };
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes('--watch')) {
    watch();
  } else {
    build();
  }
}
