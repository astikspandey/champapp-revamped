# Platform-Specific Architecture

## Overview

ChampApp now uses a **platform-aware architecture** that automatically detects your operating system and loads optimized code for your platform.

## How It Works

### 1. Automatic Platform Detection

When the server starts, it automatically detects your OS:

```
╔════════════════════════════════════════════════════╗
║          PLATFORM DETECTION                        ║
╠════════════════════════════════════════════════════╣
║ Platform:     LINUX                                ║
║ OS Type:      Linux                                ║
║ OS Release:   5.15.0-76-generic                    ║
║ Architecture: x64                                  ║
║ Node.js:      v18.17.0                             ║
╚════════════════════════════════════════════════════╝

✅ Using LINUX-optimized code path
```

### 2. Platform-Specific Code Loading

The system loads platform-optimized modules:

```
🐧 Loading Linux crypto module...
✓ Loaded linux/crypto.js
✓ Linux crypto module loaded successfully
```

### 3. Automatic Fallback

If platform-specific code isn't available, it falls back to generic code:

```
⚠️  Platform-specific module not found: linux/custom-module.js
   Falling back to generic implementation...
✓ Loaded generic custom-module.js
```

---

## Directory Structure

```
server/
├── platform-detector.ts        # Platform detection & router
├── platforms/
│   ├── linux/
│   │   └── crypto.ts          # 🐧 Linux-optimized crypto
│   ├── macos/
│   │   └── crypto.ts          # 🍎 macOS-optimized crypto
│   └── windows/
│       └── crypto.ts          # 🪟 Windows-optimized crypto
├── auth.ts                     # Uses platform-specific crypto
└── index.ts                    # Shows platform info on startup
```

---

## Supported Platforms

| Platform | Status | Icon | Module Path |
|----------|--------|------|-------------|
| **Linux** | ✅ Fully Supported | 🐧 | `platforms/linux/` |
| **macOS** | ✅ Fully Supported | 🍎 | `platforms/macos/` |
| **Windows** | ✅ Fully Supported | 🪟 | `platforms/windows/` |
| Other | ⚠️ Generic Fallback | ⚙️ | Root modules |

---

## Adding Platform-Specific Code

### Step 1: Create Platform Module

Create a file in the appropriate platform folder:

```typescript
// server/platforms/linux/my-module.ts
export function myFunction() {
  console.log('🐧 Linux-specific implementation');
  // Your Linux-optimized code here
}
```

### Step 2: Use Platform Module

Load it dynamically in your code:

```typescript
import { loadPlatformModule } from './platform-detector';

const myModule = await loadPlatformModule('my-module.js');
myModule.myFunction();
```

### Step 3: Create Fallback (Optional)

Create a generic version for unsupported platforms:

```typescript
// server/my-module.ts
export function myFunction() {
  console.log('⚙️ Generic implementation');
}
```

---

## Benefits

### ✅ Automatic OS Detection
- No manual configuration needed
- Detects Linux, macOS, Windows automatically
- Shows detailed platform info on startup

### ✅ Optimized Performance
- Each platform gets OS-specific optimizations
- Leverages platform-specific features
- Better error handling per platform

### ✅ Better Debugging
- Platform-specific error messages
- Easy to identify OS-specific issues
- Detailed logging per platform

### ✅ Graceful Fallback
- Works even without platform-specific code
- Falls back to generic implementation
- No crashes on unsupported platforms

---

## Example: Crypto Module

### Before (Generic)
```typescript
import crypto from 'crypto';
const hash = crypto.createHash('sha256').update(data).digest();
```

### After (Platform-Specific)
```typescript
// Automatically loads:
// - linux/crypto.ts on Linux 🐧
// - macos/crypto.ts on macOS 🍎
// - windows/crypto.ts on Windows 🪟

const cryptoCompat = await loadPlatformModule('crypto.js');
const hash = cryptoCompat.createHash('sha256', data);

// Platform-specific error handling:
// ❌ [Linux] Failed to create sha256 hash
// Platform: linux, Node: v18.17.0
```

---

## Testing Platform Detection

Run the platform info logger:

```bash
npm run dev
```

You'll see:
```
╔════════════════════════════════════════════════════╗
║          PLATFORM DETECTION                        ║
╠════════════════════════════════════════════════════╣
║ Platform:     MACOS                                ║
║ OS Type:      Darwin                               ║
║ OS Release:   21.6.0                               ║
║ Architecture: arm64                                ║
║ Node.js:      v20.10.0                             ║
╚════════════════════════════════════════════════════╝

✅ Using MACOS-optimized code path

🍎 Loading macOS crypto module...
✓ Loaded macos/crypto.js
✓ macOS crypto module loaded successfully
```

---

## Platform Module API

### `detectPlatform()`
Returns: `'windows' | 'macos' | 'linux' | 'unknown'`

```typescript
import { detectPlatform } from './platform-detector';
const platform = detectPlatform();
console.log(platform); // 'linux'
```

### `loadPlatformModule(moduleName)`
Loads platform-specific module with fallback

```typescript
const module = await loadPlatformModule('crypto.js');
```

### `logPlatformInfo()`
Displays detailed platform information

```typescript
import { logPlatformInfo } from './platform-detector';
logPlatformInfo();
```

### `currentPlatform`
Current platform constant

```typescript
import { currentPlatform } from './platform-detector';
if (currentPlatform === 'linux') {
  // Linux-specific logic
}
```

---

## Troubleshooting

### Issue: "Platform-specific module not found"

**Cause**: Module doesn't exist for your platform

**Solution**:
1. Create the module in `server/platforms/{platform}/`
2. Or create a generic fallback in `server/`

### Issue: Platform shows as "unknown"

**Cause**: Unsupported OS

**Solution**: The app will fall back to generic code and continue working

### Issue: Wrong platform detected

**Cause**: Very rare, usually only in virtualization

**Solution**: Check `os.platform()` output and update platform-detector.ts

---

## Future Enhancements

You can add platform-specific modules for:
- Database connections (different optimizations per OS)
- File system operations (path handling)
- Network operations (socket optimizations)
- Process management (different APIs per OS)
- Performance monitoring (OS-specific metrics)

Just create the module in the appropriate `platforms/{os}/` folder!
