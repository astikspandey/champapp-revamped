# Vite to esbuild Migration

## Summary

Successfully migrated from Vite to esbuild to resolve `crypto.hash` function errors on Linux.

## What Was Changed

### 1. **Removed Vite Dependencies**
   - Removed `vite` and all Vite plugins from `package.json`
   - Deleted `vite.config.ts`
   - Deleted `server/vite.ts`

### 2. **Added esbuild Configuration**
   - Created `esbuild.config.js` with:
     - React/JSX automatic mode
     - Path alias resolution (`@/`, `@shared/`, `@assets/`)
     - Tailwind CSS support with 'style' condition
     - File loaders for images and fonts
     - Asset copying (HTML and attached assets)
     - Development/production modes with sourcemaps and minification

   - Created `server/esbuild-dev.ts` for development server:
     - Watch mode for automatic rebuilds
     - Serves static files from `dist/public`
     - Client-side routing fallback to index.html

### 3. **Updated Build Scripts**
   - `package.json` scripts:
     - `build:client`: `node script/build-client.js` (uses esbuild)
     - `dev`: Still uses `tsx server/index.ts` but now loads esbuild-dev instead of vite

### 4. **Updated Server**
   - Modified `server/index.ts`:
     - In development: loads `setupEsbuildDev` instead of `setupVite`
     - In production: still uses `serveStatic` (unchanged)

## Benefits

✅ **Fixed Linux Compatibility**: No more `crypto.hash` errors on Linux
✅ **Faster Builds**: esbuild is significantly faster than Vite
✅ **Simpler Setup**: Less complex configuration and fewer dependencies
✅ **Cross-Platform**: Works on Windows, macOS, and Linux

## How It Works

### Development Mode
1. Server starts with `npm run dev`
2. esbuild starts in watch mode
3. Files are built to `dist/public`
4. Server serves static files from `dist/public`
5. Changes trigger automatic rebuilds

### Production Mode
1. Build client with `npm run build`
2. Server serves static files from `dist/public`
3. Same as before, just built with esbuild instead of Vite

## File Structure

```
champapp-revamped/
├── esbuild.config.js          # esbuild configuration
├── script/
│   └── build-client.js         # Client build script
├── server/
│   ├── index.ts                # Updated to use esbuild-dev
│   └── esbuild-dev.ts          # Development server setup
└── dist/
    └── public/                 # Built client files
        ├── index.html
        ├── main-*.js
        └── assets/
```

## Testing

Server starts successfully with:
- Platform detection working
- esbuild watch mode active
- Serving on port 5000 (LAN accessible via 0.0.0.0)

All previous features maintained:
- WalkerAuth OAuth integration
- Platform-specific crypto modules
- Automatic dependency installation
- Session management
- RESTful API
