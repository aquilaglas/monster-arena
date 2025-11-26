# 🤝 Guide de Contribution - Monster Arena

Merci de votre intérêt pour contribuer à Monster Arena ! Ce guide vous aidera à démarrer.

## 📋 Table des Matières

1. [Code de Conduite](#code-de-conduite)
2. [Comment Contribuer](#comment-contribuer)
3. [Configuration du Projet](#configuration-du-projet)
4. [Standards de Code](#standards-de-code)
5. [Processus de Pull Request](#processus-de-pull-request)
6. [Signaler des Bugs](#signaler-des-bugs)
7. [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)

## 📜 Code de Conduite

En participant à ce projet, vous vous engagez à :

- ✅ Être respectueux et inclusif
- ✅ Accepter les critiques constructives
- ✅ Se concentrer sur ce qui est meilleur pour la communauté
- ✅ Faire preuve d'empathie envers les autres

## 🚀 Comment Contribuer

Il existe plusieurs façons de contribuer :

### 1. 🎨 Créer des Images de Monstres

Le projet a besoin d'images de monstres au style pixel art ! Voir `static/IMAGES_README.md`.

### 2. 🐛 Corriger des Bugs

Consultez les [issues](https://github.com/votre-username/monster-arena/issues) marquées `bug`.

### 3. ✨ Ajouter des Fonctionnalités

- Système de compétences spéciales pour les monstres
- Multijoueur en ligne
- Plus de types de monstres
- Système d'évolution
- Quêtes quotidiennes

### 4. 📝 Améliorer la Documentation

- Traduire le README
- Ajouter des exemples
- Créer des tutoriels vidéo

### 5. 🧪 Écrire des Tests

Augmenter la couverture de code avec plus de tests.

## 🔧 Configuration du Projet

### Fork et Clone

```bash
# Forker le projet sur GitHub, puis :
git clone https://github.com/VOTRE-USERNAME/monster-arena.git
cd monster-arena
```

### Installer les Dépendances

```bash
npm install
```

### Créer une Branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

### Lancer en Mode Développement

```bash
npm run dev
```

## 📐 Standards de Code

### TypeScript

- Toujours typer vos variables et fonctions
- Éviter `any` autant que possible
- Utiliser les interfaces définies dans `src/lib/types.ts`

### Svelte 5

- Utiliser les runes Svelte 5 (`$state`, `$derived`, `$effect`)
- Composants dans `src/lib/components/`
- Stores dans `src/lib/stores/`

### Style

```bash
# Formattage automatique
npm run format

# Vérification du style
npx prettier --check .
```

### Linting

```bash
# Vérifier les erreurs
npm run lint

# Corriger automatiquement
npm run lint -- --fix
```

### Tests

```bash
# Lancer tous les tests
npm run test

# Mode watch
npm run test:watch
```

### Commits

Utilisez des messages de commit clairs :

```
feat: ajouter système d'évolution des monstres
fix: corriger calcul des dégâts en combat
docs: mettre à jour README avec instructions
style: formater code avec prettier
test: ajouter tests pour système de boutique
refactor: simplifier logique de combat
```

Préfixes recommandés :
- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage (ne change pas la logique)
- `refactor:` - Refactorisation
- `test:` - Ajout ou modification de tests
- `chore:` - Maintenance

## 🔀 Processus de Pull Request

### 1. Vérifications Avant PR

```bash
# Tout doit passer sans erreur
npm run check
npm run lint
npm run test
npm run build
```

### 2. Mettre à Jour Votre Branche

```bash
git fetch origin
git rebase origin/master
```

### 3. Push Vers Votre Fork

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

### 4. Créer la Pull Request

Sur GitHub :
1. Cliquez sur "New Pull Request"
2. Sélectionnez votre branche
3. Remplissez le template :

```markdown
## Description
Brève description de vos changements

## Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Documentation
- [ ] Refactoring

## Tests
- [ ] Tests unitaires ajoutés/modifiés
- [ ] Tests manuels effectués
- [ ] Build réussit

## Captures d'Écran
Si applicable

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation
- [ ] Mes changements ne génèrent pas de warnings
- [ ] J'ai ajouté des tests
```

### 5. Révision de Code

- Attendez la révision d'un mainteneur
- Répondez aux commentaires
- Effectuez les modifications demandées
- Soyez patient et respectueux

## 🐛 Signaler des Bugs

### Avant de Signaler

1. Vérifiez que le bug n'est pas déjà signalé
2. Essayez de reproduire le bug
3. Collectez les informations nécessaires

### Template de Bug Report

```markdown
**Description du Bug**
Description claire et concise du bug.

**Comment Reproduire**
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

**Comportement Attendu**
Ce qui devrait se passer.

**Captures d'Écran**
Si applicable.

**Environnement**
- OS: [e.g. Ubuntu 22.04]
- Node.js: [e.g. 20.10.0]
- Navigateur: [e.g. Chrome 120]

**Contexte Additionnel**
Toute information utile.
```

## 💡 Proposer des Fonctionnalités

### Template de Feature Request

```markdown
**Problème à Résoudre**
Quel problème cette fonctionnalité résout-elle ?

**Solution Proposée**
Description de la fonctionnalité.

**Alternatives Considérées**
Autres approches envisagées.

**Informations Additionnelles**
Mockups, exemples, etc.
```

## 🏗️ Structure du Code

### Ajouter une Nouvelle Page

```bash
src/routes/ma-page/
├── +page.svelte          # Interface
└── +page.server.ts       # Logique serveur (optionnel)
```

### Ajouter un Nouveau Composant

```bash
src/lib/components/
└── MonComposant.svelte
```

### Ajouter une Nouvelle Route API

```bash
src/routes/api/ma-route/
└── +server.ts
```

### Ajouter une Nouvelle Fonctionnalité de Jeu

```bash
src/lib/game/
└── ma-fonctionnalite.ts
```

## 🎨 Guidelines UI/UX

### Style Rétro

- Police : Press Start 2P
- Bordures épaisses (4px)
- Couleurs vives
- Animations simples
- Pixel art

### Composants

Utilisez les composants existants :
- `Button.svelte`
- `Card.svelte`
- `MonsterCard.svelte`
- `StatBar.svelte`

### Couleurs

```css
primary: #ff6b6b
secondary: #4ecdc4
accent: #ffe66d
dark: #2d3436
light: #dfe6e9
```

## 🧪 Écrire des Tests

### Test d'une Fonction

```typescript
import { describe, it, expect } from 'vitest';
import { maFonction } from './mon-fichier';

describe('Ma Fonction', () => {
  it('devrait faire quelque chose', () => {
    const result = maFonction(input);
    expect(result).toBe(expected);
  });
});
```

### Test d'un Composant Svelte

```typescript
import { render } from '@testing-library/svelte';
import MonComposant from './MonComposant.svelte';

it('devrait afficher le texte', () => {
  const { getByText } = render(MonComposant, { props: { ... } });
  expect(getByText('Mon texte')).toBeInTheDocument();
});
```

## 📦 Release

Les releases sont gérées par les mainteneurs via GitHub Actions.

## 🙏 Remerciements

Merci pour votre contribution ! Chaque contribution, grande ou petite, est appréciée.

## 📞 Questions ?

N'hésitez pas à :
- Ouvrir une [Discussion](https://github.com/votre-username/monster-arena/discussions)
- Rejoindre notre Discord (si applicable)
- Envoyer un email

---

**Happy Coding! 🎮👾**
