# Installation Guide

## System Requirements

- Node.js 18+ or 20+
- npm 9+ or yarn 3+
- Git

### For Desktop App Development
- Electron dependencies (included in npm packages)
- Python 3 (for native module compilation on some platforms)
- Windows: Visual Studio 2019+ or Build Tools
- macOS: Xcode Command Line Tools
- Linux: Build essentials

## Quick Start

### Browser Version

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/monster-arena.git
cd monster-arena

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
\`\`\`

### Desktop Version

\`\`\`bash
# Install dependencies
npm install

# Run dev server + Electron
npm run dev:desktop

# The Electron app will automatically open
\`\`\`

## Build Instructions

### For Production Web

\`\`\`bash
# Build optimized Next.js bundle
npm run build

# Start production server
npm start
\`\`\`

### For Desktop Application

\`\`\`bash
# Build for all platforms (Windows, macOS, Linux)
npm run build:desktop

# Installers will be created in the dist/ folder
\`\`\`

To build for specific platforms only:

\`\`\`bash
# Windows only (must run on Windows)
npm run build:desktop -- -w

# macOS only (must run on macOS)
npm run build:desktop -- -m

# Linux only (must run on Linux)
npm run build:desktop -- -l
\`\`\`

## Deployment

### Deploy to Vercel (Browser)

1. Push to GitHub
2. Connect repository to Vercel
3. Vercel auto-detects Next.js and deploys

\`\`\`bash
vercel deploy
\`\`\`

### Distribute Desktop App

1. Build the app: `npm run build:desktop`
2. Installers are in the `dist/` folder:
   - **Windows**: `.exe` files (NSIS installer + portable)
   - **macOS**: `.dmg` file (disk image)
   - **Linux**: `.AppImage` + `.deb` files

3. Upload to GitHub Releases or your distribution platform
4. Users can download and install directly

## Troubleshooting Installation

### npm install fails
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
\`\`\`

### Port 3000 already in use
\`\`\`bash
# Use a different port
PORT=3001 npm run dev
\`\`\`

### Electron window doesn't appear
1. Check DevTools (F12) for errors
2. Ensure Node.js version is compatible
3. Reinstall Electron: `npm install --force electron`

### Build fails
\`\`\`bash
# Clean all build artifacts
rm -rf .next dist node_modules

# Reinstall and rebuild
npm install
npm run build:desktop
\`\`\`

## Development Workflow

1. **Make changes** to components, pages, or game logic
2. **Dev server hot-reloads** automatically
3. **Test in browser**: http://localhost:3000
4. **Test in Electron** with `npm run dev:desktop`
5. **Lint code**: `npm run lint`
6. **Format code**: `npm run format`
7. **Commit and push** to version control

## CI/CD Pipeline

GitHub Actions automatically:
- Lints code on every push
- Builds Next.js and Electron
- Runs on Node.js 18 and 20

When you tag a release (v1.0.0), it builds desktop installers for all platforms.

## Performance Optimization

- Next.js automatically optimizes builds
- Tailwind CSS is tree-shaken
- Images are optimized
- Code splitting for faster loads

For more info, see [ELECTRON_SETUP.md](./ELECTRON_SETUP.md)
