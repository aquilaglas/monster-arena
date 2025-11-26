# 🎮 Monster Arena

Un jeu d'arène de monstres de style rétro développé avec SvelteKit 5 et Electron. Entraînez vos monstres, combattez dans l'arène et devenez le champion ultime !

![Monster Arena](https://img.shields.io/badge/Version-1.0.0-blue)
![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-orange)
![Electron](https://img.shields.io/badge/Electron-28.2-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fonctionnalités

### 🏟️ Système d'Arène Progressive
- **50 niveaux de combat** avec difficulté croissante
- **Boss tous les 5 niveaux** pour des défis épiques
- **Récompenses en argent** proportionnelles au niveau
- Visualisation des prochains adversaires

### 👾 Collection de Monstres
- **16 types de monstres différents** (12 normaux + 4 boss)
- Chaque monstre a des statistiques uniques (PV, Attaque, Défense, Vitesse)
- **Système de niveaux** pour vos monstres
- Images au style pixel art rétro

### ⚔️ Système de Combat
- Combats au tour par tour style Pokémon
- Calcul intelligent des dégâts basé sur Attaque vs Défense
- Initiative basée sur la Vitesse
- Journal de combat détaillé
- Animations rétro

### 💪 Entraînement
- Améliorez les statistiques de vos monstres
- 4 types d'entraînement disponibles :
  - 💚 **Points de Vie** (+10 PV pour 100€)
  - ⚔️ **Attaque** (+5 ATT pour 150€)
  - 🛡️ **Défense** (+5 DEF pour 150€)
  - ⚡ **Vitesse** (+3 VIT pour 120€)

### 🛒 Boutique
- Achetez de nouveaux monstres avec l'argent gagné
- 12 monstres disponibles de 500€ à 3500€
- Prévisualisation des statistiques avant achat

### 💰 Système Économique
- Gagnez de l'argent en combattant
- Dépensez de l'argent pour entraîner vos monstres
- Achetez de nouveaux monstres dans la boutique

## 🚀 Installation et Configuration

### Prérequis

- **Node.js** 20.x ou supérieur
- **npm** ou **pnpm**
- **PostgreSQL** (via Neon Database)
- **Git**

### 1. Cloner le Projet

```bash
git clone https://github.com/votre-username/monster-arena.git
cd monster-arena
```

### 2. Installer les Dépendances

```bash
npm install
# ou
pnpm install
```

### 3. Configuration de la Base de Données

#### 3.1 Vérifier la connexion

La base de données Neon est déjà configurée dans le fichier `.env.example`. Copiez-le :

```bash
cp .env.example .env
```

#### 3.2 Créer les tables et insérer les données

```bash
# Rendre le script exécutable
chmod +x database/setup.sh

# Exécuter le script
./database/setup.sh
```

Ou manuellement avec psql :

```bash
# Créer le schéma
psql "postgresql://neondb_owner:npg_OTuzAq1veb5x@ep-weathered-breeze-ad2zbr0i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -f database/schema.sql

# Insérer les données
psql "postgresql://neondb_owner:npg_OTuzAq1veb5x@ep-weathered-breeze-ad2zbr0i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -f database/seed.sql
```

### 4. Lancer l'Application

#### Mode Développement Web

```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173

#### Mode Développement Electron

```bash
npm run electron:dev
```

Cela lance à la fois le serveur de développement et l'application Electron.

### 5. Build Production

#### Build Web

```bash
npm run build
npm run preview
```

#### Build Electron

```bash
npm run electron:build
```

Les fichiers de distribution seront générés dans le dossier `dist-electron/`.

## 🏗️ Structure du Projet

```
monster-arena/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI/CD pour tests et build
│       └── release.yml         # Création des releases
├── database/
│   ├── schema.sql              # Schéma de la base de données
│   ├── seed.sql                # Données initiales
│   └── setup.sh                # Script d'installation
├── electron/
│   ├── main.cjs                # Process principal Electron
│   └── preload.cjs             # Script de préchargement
├── src/
│   ├── lib/
│   │   ├── components/         # Composants Svelte réutilisables
│   │   │   ├── Button.svelte
│   │   │   ├── Card.svelte
│   │   │   ├── Header.svelte
│   │   │   ├── MonsterCard.svelte
│   │   │   └── StatBar.svelte
│   │   ├── game/               # Logique du jeu
│   │   │   ├── arena.ts        # Gestion de l'arène
│   │   │   ├── combat.ts       # Système de combat
│   │   │   ├── player.ts       # Gestion du joueur
│   │   │   ├── shop.ts         # Logique de la boutique
│   │   │   └── training.ts     # Système d'entraînement
│   │   ├── stores/             # Stores Svelte 5
│   │   │   └── game.svelte.ts  # État global du jeu
│   │   ├── db.ts               # Connexion PostgreSQL
│   │   └── types.ts            # Types TypeScript
│   ├── routes/
│   │   ├── api/                # Routes API
│   │   │   ├── arena/
│   │   │   ├── combat/
│   │   │   ├── monsters/
│   │   │   ├── player/
│   │   │   ├── shop/
│   │   │   └── training/
│   │   ├── arena/              # Page de l'arène
│   │   ├── monsters/           # Gestion des monstres
│   │   ├── shop/               # Boutique
│   │   ├── training/           # Entraînement
│   │   ├── +layout.svelte      # Layout principal
│   │   └── +page.svelte        # Menu principal
│   ├── app.css                 # Styles globaux
│   └── app.html                # Template HTML
├── static/
│   ├── monsters/               # Images des monstres
│   │   └── IMAGES_README.md    # Guide pour créer les images
│   └── favicon.png
├── .eslintrc.json              # Configuration ESLint
├── .prettierrc                 # Configuration Prettier
├── package.json
├── svelte.config.js            # Configuration SvelteKit
├── tailwind.config.js          # Configuration TailwindCSS
├── tsconfig.json               # Configuration TypeScript
└── vite.config.ts              # Configuration Vite
```

## 🎨 Ajouter des Images de Monstres

Les images de monstres ne sont pas incluses par défaut. Vous pouvez :

### Option 1 : Créer vos propres sprites

Utilisez des outils comme :
- [Piskel](https://www.piskelapp.com/) - Éditeur en ligne gratuit
- [Pixilart](https://www.pixilart.com/) - Outil de pixel art
- [Aseprite](https://www.aseprite.org/) - Logiciel professionnel

Format recommandé : PNG 128x128 ou 256x256 pixels

### Option 2 : Télécharger des sprites gratuits

- [OpenGameArt.org](https://opengameart.org/)
- [Itch.io](https://itch.io/game-assets/free)
- [Kenney.nl](https://kenney.nl/)

### Liste des images à créer :

Placez les fichiers PNG dans `static/monsters/` :

**Monstres de base :**
- `flammy.png`, `aqualis.png`, `terros.png`, `voltix.png`

**Monstres intermédiaires :**
- `infernus.png`, `glacior.png`, `zephyr.png`, `titanor.png`

**Monstres avancés :**
- `shadowclaw.png`, `luminos.png`, `venomfang.png`, `crystallia.png`

**Boss :**
- `boss_pyrothor.png`, `boss_leviathan.png`, `boss_stormlord.png`, `boss_chronos.png`

Voir `static/IMAGES_README.md` pour plus de détails.

## 🧪 Tests et Qualité du Code

### Linter

```bash
npm run lint
```

### Formattage

```bash
npm run format
```

### Vérification des types

```bash
npm run check
```

### Tests

```bash
npm run test
```

## 🔧 Technologies Utilisées

### Frontend
- **SvelteKit 5** - Framework web moderne avec Svelte 5
- **TailwindCSS** - Framework CSS utilitaire
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide

### Backend
- **PostgreSQL** (Neon) - Base de données
- **postgres.js** - Client PostgreSQL

### Desktop
- **Electron 28** - Framework pour applications de bureau

### DevOps
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formattage du code
- **GitHub Actions** - CI/CD
- **Vitest** - Framework de test

## 📦 Base de Données

### Schéma

Le jeu utilise 7 tables principales :
- `players` - Informations des joueurs
- `monster_types` - Types de monstres (templates)
- `player_monsters` - Monstres possédés par les joueurs
- `arena_opponents` - Configuration des adversaires de l'arène
- `combat_history` - Historique des combats
- `training_history` - Historique des entraînements

### Hébergement

La base de données est hébergée sur **Neon** (PostgreSQL serverless).

## 🎮 Comment Jouer

1. **Démarrer** : Vous commencez avec un Flammy niveau 5 et 1000€
2. **Combattre** : Allez dans l'arène pour combattre des adversaires
3. **Gagner de l'argent** : Chaque victoire rapporte de l'argent
4. **Entraîner** : Améliorez les stats de vos monstres
5. **Acheter** : Achetez de nouveaux monstres dans la boutique
6. **Progresser** : Battez les 50 niveaux de l'arène !

### Conseils Stratégiques

- 💡 **Entraînez régulièrement** : Un monstre bien entraîné est plus fort
- 💡 **Équilibrez vos stats** : Ne négligez pas la défense et la vitesse
- 💡 **Boss = gros gains** : Les boss rapportent 3x plus d'argent
- 💡 **Diversifiez** : Achetez plusieurs monstres pour différentes stratégies
- 💡 **La vitesse décide** : Le monstre le plus rapide attaque en premier

## 🚢 Déploiement

### Application Web

L'application peut être déployée sur :
- **Vercel** (recommandé pour SvelteKit)
- **Netlify**
- **Cloudflare Pages**

### Application Desktop

Utilisez le workflow GitHub Actions `release.yml` pour générer automatiquement des builds pour :
- Windows (exe, portable)
- macOS (dmg)
- Linux (AppImage, deb)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 🙏 Remerciements

- Police rétro : [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
- Inspiration : Pokémon, Monster Rancher
- Base de données : [Neon](https://neon.tech/)

## 📧 Contact

Pour toute question ou suggestion, ouvrez une issue sur GitHub !

---

**Bon jeu ! 🎮👾**
