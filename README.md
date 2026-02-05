# Monster Arena

Un jeu d'arene de monstres de style retro developpe avec SvelteKit 5, Electron et PostgreSQL.

Collectionnez des monstres, entrainez-les et affrontez 50 niveaux d'arene pour devenir champion.

## Fonctionnalites

- **Arene progressive** : 50 niveaux avec des boss tous les 5 niveaux, mode replay a 50% de recompense
- **Systeme de combat** : combat au tour par tour avec un systeme pierre-feuille-ciseaux, avantages de types elementaires, calcul de degats (attaque, defense, vitesse, multiplicateurs)
- **16 monstres** : 12 monstres normaux + 4 boss avec des statistiques uniques (PV, Attaque, Defense, Vitesse)
- **Entrainement** : ameliorez les stats de vos monstres avec un systeme base sur la duree (1 min/point), 4 types d'entrainement disponibles
- **Boutique** : achetez de nouveaux monstres avec l'argent gagne en combat

## Stack technique

- **Frontend** : SvelteKit 5 (Svelte 5 runes) + TypeScript + Tailwind CSS
- **Desktop** : Electron 28
- **Base de donnees** : PostgreSQL (Neon DB)
- **Build** : Vite 5, adapter-static, electron-builder

## Prerequis

- Node.js 20+
- npm
- PostgreSQL (ou un compte Neon)

## Installation

```bash
git clone <url-du-repo>
cd monster-arena
npm install
```

## Configuration de la base de donnees

Copiez le fichier d'environnement et ajustez la connexion si necessaire :

```bash
cp .env.example .env
```

Creez les tables et inserez les donnees initiales :

```bash
chmod +x database/setup.sh
./database/setup.sh
```

Ou manuellement :

```bash
psql "<votre-connection-string>" -f database/schema.sql
psql "<votre-connection-string>" -f database/seed.sql
```

## Lancement

### Mode web (developpement)

```bash
npm run dev
```

Accessible sur http://localhost:5173

### Mode Electron (developpement)

```bash
npm run electron:dev
```

Lance le serveur Vite et l'application Electron simultanement.

### Build production (web)

```bash
npm run build
npm run preview
```

### Build production (Electron)

```bash
npm run electron:build
```

Les fichiers sont generes dans `dist-electron/`.

## Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de developpement Vite |
| `npm run build` | Build de production |
| `npm run preview` | Preview du build |
| `npm run electron:dev` | Dev avec Electron |
| `npm run electron:build` | Build Electron (AppImage, deb, nsis) |
| `npm run check` | Verification TypeScript |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run test` | Tests avec Vitest |

## Structure du projet

```
monster-arena/
├── database/           # Schema SQL, seed et migrations
├── electron/           # Process principal et preload Electron
├── src/
│   ├── lib/
│   │   ├── components/ # Button, Card, Header, MonsterCard, StatBar
│   │   ├── game/       # Logique : arena, combat, player, shop, training
│   │   ├── stores/     # Store reactif Svelte 5 (game state)
│   │   ├── db.ts       # Connexion PostgreSQL
│   │   └── types.ts    # Interfaces TypeScript
│   └── routes/
│       ├── api/        # Endpoints REST (player, monsters, arena, combat, training, shop)
│       ├── arena/      # Page arene
│       ├── monsters/   # Page collection
│       ├── shop/       # Page boutique
│       ├── training/   # Page entrainement
│       └── +page.svelte # Menu principal
├── static/monsters/    # SVG des monstres
└── resources/          # Ressources electron-builder
```

## Base de donnees

6 tables PostgreSQL : `players`, `monster_types`, `player_monsters`, `arena_opponents`, `combat_history`, `training_history`.

Le joueur demarre avec 1000 euros et un Flammy niveau 5.
