# Arène des Monstres (Monster Arena)

A French-language monster battle game built with Next.js, React, TypeScript, and Electron.

## Features

- **Monster Collection**: Collect and train various monsters with unique stats
- **Arena Combat**: Battle monsters in a tiered progression system
- **Training System**: Improve monster stats through training (costs money)
- **Shop System**: Purchase new monsters with earned money
- **Progressive Difficulty**: Climb through 5 tiers with boss fights every 5th battle
- **Desktop & Browser**: Play in your browser or as a desktop app via Electron

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS v4
- **Desktop**: Electron
- **Code Quality**: ESLint, Prettier
- **CI/CD**: GitHub Actions

## Installation

### Browser (Development)

\`\`\`bash
# Clone repository
git clone <repository-url>
cd monster-arena

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
\`\`\`

### Desktop (Development)

\`\`\`bash
# Install dependencies
npm install

# Run with Electron (starts Next.js dev server + Electron)
npm run dev:desktop
\`\`\`

### Desktop (Production)

\`\`\`bash
# Build Next.js
npm run build

# Package as desktop app (creates distributable in dist/)
npm run build:desktop
\`\`\`

## Project Structure

\`\`\`
monster-arena/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx (Main Menu)
│   ├── game/
│   │   └── page.tsx (Combat Arena)
│   ├── monsters/
│   │   └── page.tsx (Monster List)
│   ├── shop/
│   │   └── page.tsx (Buy Monsters)
│   └── api/
│       ├── combat/
│       ├── training/
│       ├── monsters/
│       └── player/
├── components/
│   ├── ui/
│   ├── combat/
│   ├── monster/
│   └── shop/
├── hooks/
├── lib/
├── types/
├── public/
│   └── images/ (Monster images)
├── electron/
│   ├── main.ts (Electron main process)
│   ├── preload.ts
│   └── builds/ (Built apps)
├── .github/
│   └── workflows/
│       └── ci.yml (GitHub Actions)
├── public/
├── next.config.mjs
├── tsconfig.json
└── package.json
\`\`\`

## Game Mechanics

### Money System

- **Earn**: 10 coins per battle win, 50 coins for boss battles
- **Spend**: 20 coins per training session, 100-300 coins to buy monsters

### Training System

- Increases monster stats: Attack, Defense, Speed, HP
- Training duration: 5-30 seconds
- Cost: 20 coins per session

### Arena System

- **Tier 1-5**: Progressive difficulty levels
- **Boss Battles**: Every 5th fight (fights 5, 10, 15, 20, 25)
- **Rewards**: Higher tiers = more money per win

### Combat

- Turn-based battle system
- Monster stats determine attack damage and defense
- Speed determines turn order
- Battle continues until one monster is defeated

## French Localization

All UI text, labels, and messages are in French:
- Menus: "Arène des Monstres", "Mes Monstres", "Boutique"
- Actions: "Attaquer", "Fuir", "Entraîner"
- Stats: "Attaque", "Défense", "Vitesse", "PV"

## Development Scripts

\`\`\`bash
npm run dev          # Start Next.js dev server
npm run dev:desktop  # Start Next.js + Electron
npm run build        # Build for production
npm run build:desktop # Package Electron app
npm run lint         # Run ESLint
npm run format       # Format with Prettier
\`\`\`

## GitHub Actions CI/CD

Automatically runs on every push:
- ESLint checks
- Next.js build verification
- Tests (configured in CI workflow)

## License

MIT
