# 📦 Guide d'Installation - Monster Arena

Ce guide vous accompagne pas à pas pour installer et configurer Monster Arena.

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation Rapide](#installation-rapide)
3. [Configuration de la Base de Données](#configuration-de-la-base-de-données)
4. [Lancement de l'Application](#lancement-de-lapplication)
5. [Résolution de Problèmes](#résolution-de-problèmes)

## ✅ Prérequis

### Logiciels Requis

| Logiciel | Version Minimale | Vérification |
|----------|-----------------|--------------|
| Node.js  | 20.x           | `node --version` |
| npm      | 10.x           | `npm --version` |
| Git      | 2.x            | `git --version` |
| PostgreSQL Client (psql) | 14.x | `psql --version` |

### Installation des Prérequis

#### Sur Ubuntu/Debian

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL Client
sudo apt-get install -y postgresql-client

# Git
sudo apt-get install -y git
```

#### Sur macOS

```bash
# Homebrew (si pas déjà installé)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js
brew install node@20

# PostgreSQL Client
brew install postgresql@14

# Git
brew install git
```

#### Sur Windows

1. Téléchargez et installez [Node.js 20.x](https://nodejs.org/)
2. Téléchargez et installez [Git](https://git-scm.com/download/win)
3. Téléchargez et installez [PostgreSQL](https://www.postgresql.org/download/windows/)

## 🚀 Installation Rapide

### Étape 1 : Cloner le Projet

```bash
git clone https://github.com/votre-username/monster-arena.git
cd monster-arena
```

### Étape 2 : Installer les Dépendances

```bash
npm install
```

Cette commande va installer toutes les dépendances nécessaires (environ 5 minutes).

### Étape 3 : Configuration de l'Environnement

Le fichier `.env` est déjà créé avec la configuration de la base de données Neon.

## 🗄️ Configuration de la Base de Données

### Option 1 : Script Automatique (Recommandé)

```bash
# Rendre le script exécutable
chmod +x database/setup.sh

# Exécuter le script
./database/setup.sh
```

Le script va :
1. ✅ Créer toutes les tables
2. ✅ Insérer les types de monstres
3. ✅ Créer les niveaux de l'arène
4. ✅ Créer un joueur de test avec un monstre de départ

### Option 2 : Installation Manuelle

Si le script ne fonctionne pas, utilisez psql directement :

```bash
# URL de connexion
DATABASE_URL="postgresql://neondb_owner:npg_OTuzAq1veb5x@ep-weathered-breeze-ad2zbr0i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Créer les tables
psql "$DATABASE_URL" -f database/schema.sql

# Insérer les données
psql "$DATABASE_URL" -f database/seed.sql
```

### Vérification de l'Installation

Pour vérifier que la base de données est correctement configurée :

```bash
psql "postgresql://neondb_owner:npg_OTuzAq1veb5x@ep-weathered-breeze-ad2zbr0i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT COUNT(*) FROM monster_types;"
```

Vous devriez voir : `16` (16 types de monstres)

## 🎮 Lancement de l'Application

### Mode Web (Développement)

```bash
npm run dev
```

Ouvrez votre navigateur sur : http://localhost:5173

### Mode Electron (Application de Bureau)

```bash
npm run electron:dev
```

L'application de bureau va s'ouvrir automatiquement.

### Build de Production

#### Build Web

```bash
npm run build
npm run preview
```

#### Build Electron

```bash
npm run electron:build
```

Les fichiers seront dans le dossier `dist-electron/`.

## 🔧 Résolution de Problèmes

### Problème : "psql : command not found"

**Solution :**
Installez le client PostgreSQL :

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql@14

# Windows
# Ajoutez le dossier bin de PostgreSQL à votre PATH
```

### Problème : "Cannot connect to database"

**Solution :**
1. Vérifiez votre connexion internet
2. Vérifiez que l'URL de la base de données est correcte dans `.env`
3. Testez la connexion :

```bash
psql "postgresql://neondb_owner:npg_OTuzAq1veb5x@ep-weathered-breeze-ad2zbr0i-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -c "SELECT 1;"
```

### Problème : "Port 5173 already in use"

**Solution :**
Changez le port dans `vite.config.ts` :

```typescript
export default defineConfig({
  server: {
    port: 3000 // ou un autre port disponible
  }
});
```

### Problème : npm install échoue

**Solution :**
1. Nettoyez le cache npm :

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

2. Ou utilisez pnpm à la place :

```bash
npm install -g pnpm
pnpm install
```

### Problème : Electron ne démarre pas

**Solution :**
1. Reconstruisez Electron :

```bash
npm run build
```

2. Vérifiez que le port 5173 n'est pas bloqué par un firewall

### Problème : Les images des monstres ne s'affichent pas

**Solution :**
C'est normal ! Les images ne sont pas incluses par défaut. Consultez `static/IMAGES_README.md` pour savoir comment ajouter vos propres images.

## 📚 Prochaines Étapes

Maintenant que l'installation est terminée :

1. ✅ Lisez le [README.md](README.md) pour comprendre le jeu
2. ✅ Ajoutez vos images de monstres (voir `static/IMAGES_README.md`)
3. ✅ Commencez à jouer !

## 🆘 Besoin d'Aide ?

Si vous rencontrez des problèmes non listés ici :

1. Consultez les [Issues GitHub](https://github.com/votre-username/monster-arena/issues)
2. Ouvrez une nouvelle issue avec :
   - Votre système d'exploitation
   - La version de Node.js (`node --version`)
   - Le message d'erreur complet
   - Les étapes pour reproduire le problème

Bon jeu ! 🎮👾
