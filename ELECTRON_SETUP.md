# Electron Desktop Setup Guide

## Development

To run the Monster Arena game as a desktop application in development mode:

\`\`\`bash
# Install dependencies
npm install

# Run Next.js dev server + Electron
npm run dev:desktop
\`\`\`

This command starts:
1. Next.js dev server on http://localhost:3000
2. Electron app that loads the dev server

The Electron window will automatically open and hot-reload as you make changes.

## Production Build

To build and package the desktop application:

\`\`\`bash
# Build Next.js and Electron
npm run build:desktop
\`\`\`

This process:
1. Builds the Next.js production bundle
2. Compiles TypeScript Electron code
3. Packages with electron-builder

The output will be in `dist/` folder with installers for:
- Windows (NSIS installer + portable)
- macOS (DMG + ZIP)
- Linux (AppImage + DEB)

## Project Structure

\`\`\`
electron/
├── main.ts           # Electron main process
├── preload.ts        # IPC preload script
├── tsconfig.json     # TypeScript config for Electron
└── dist/             # Compiled Electron files (generated)
\`\`\`

## Scripts

- `npm run dev` - Start Next.js dev server only
- `npm run dev:desktop` - Start Next.js + Electron
- `npm run build` - Build Next.js
- `npm run build:desktop` - Full build + package for desktop
- `npm run build:electron` - Compile Electron TypeScript only
- `npm run package:electron` - Package with electron-builder only
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## IPC Communication

The preload script exposes an `electron` object to the renderer:

\`\`\`typescript
// In React components
const version = await window.electron.getAppVersion();
const appName = await window.electron.getAppName();
\`\`\`

## Building for Different Platforms

The `electron-builder.json` configuration handles:
- **Windows**: NSIS installer and portable executable
- **macOS**: DMG disk image and ZIP archive
- **Linux**: AppImage and DEB package

To build for a specific platform on another OS, use:

\`\`\`bash
npm run build:desktop -- -w   # Windows
npm run build:desktop -- -m   # macOS
npm run build:desktop -- -l   # Linux
\`\`\`

## Troubleshooting

**Dev server not starting:**
- Make sure port 3000 is available
- Check that `wait-on` package is installed

**Electron window blank:**
- Check browser DevTools (F12 in Electron window)
- Ensure dev server is running on http://localhost:3000
- Check electron/main.ts console for errors

**Build fails:**
- Clean previous builds: `rm -rf dist electron/dist .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (requires 14+)

## Development Tips

1. Use DevTools in development for debugging
2. App data persists between builds in user's app directory
3. Modify `electron/main.ts` to change window size, icons, or behavior
4. Update `electron-builder.json` for signing and publisher settings
