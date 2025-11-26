// Script pour générer des images placeholder SVG pour les monstres
const fs = require('fs');
const path = require('path');

const monstersDir = path.join(__dirname, '../static/monsters');

// S'assurer que le dossier existe
if (!fs.existsSync(monstersDir)) {
  fs.mkdirSync(monstersDir, { recursive: true });
}

const monsters = [
  { name: 'flammy', emoji: '🔥', color: '#ff6b6b' },
  { name: 'aqualis', emoji: '💧', color: '#4ecdc4' },
  { name: 'terros', emoji: '🪨', color: '#a0522d' },
  { name: 'voltix', emoji: '⚡', color: '#ffe66d' },
  { name: 'infernus', emoji: '🐲', color: '#ff3333' },
  { name: 'glacior', emoji: '❄️', color: '#87ceeb' },
  { name: 'zephyr', emoji: '🌪️', color: '#b0e0e6' },
  { name: 'titanor', emoji: '🗿', color: '#696969' },
  { name: 'shadowclaw', emoji: '🌑', color: '#2d3436' },
  { name: 'luminos', emoji: '✨', color: '#ffd700' },
  { name: 'venomfang', emoji: '🐍', color: '#9370db' },
  { name: 'crystallia', emoji: '💎', color: '#e0ffff' },
  { name: 'boss_pyrothor', emoji: '👑🔥', color: '#8b0000' },
  { name: 'boss_leviathan', emoji: '👑🌊', color: '#00008b' },
  { name: 'boss_stormlord', emoji: '👑⚡', color: '#ffa500' },
  { name: 'boss_chronos', emoji: '👑⏰', color: '#4b0082' },
  { name: 'placeholder', emoji: '❓', color: '#95a5a6' },
];

function createSVG(emoji, color, name) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="${color}"/>
  <rect x="16" y="16" width="224" height="224" fill="white" stroke="black" stroke-width="4"/>
  <text x="128" y="140" font-size="80" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
  <text x="128" y="220" font-size="16" text-anchor="middle" fill="black" font-family="monospace">${name.toUpperCase()}</text>
</svg>`;
}

console.log('🎨 Génération des images placeholder...');

monsters.forEach((monster) => {
  const svg = createSVG(monster.emoji, monster.color, monster.name);
  const filePath = path.join(monstersDir, `${monster.name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✅ ${monster.name}.svg créé`);
});

// Créer aussi les icônes de l'app
const appIconSVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <rect width="256" height="256" fill="#ff6b6b"/>
  <rect x="16" y="16" width="224" height="224" fill="white" stroke="black" stroke-width="4"/>
  <text x="128" y="140" font-size="80" text-anchor="middle" dominant-baseline="middle">👾</text>
  <text x="128" y="220" font-size="20" text-anchor="middle" fill="black" font-family="monospace" font-weight="bold">ARENA</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, '../static/icon.svg'), appIconSVG);
fs.writeFileSync(path.join(__dirname, '../static/favicon.svg'), appIconSVG);

console.log('✅ icon.svg et favicon.svg créés');
console.log('');
console.log('📝 Note: Les fichiers SVG ont été créés. Pour une meilleure expérience:');
console.log('   1. Utilisez https://www.pixilart.com/ pour créer de vrais sprites pixel art');
console.log('   2. Ou convertissez les SVG en PNG avec: npm install -g sharp-cli && sharp -i *.svg -o *.png');
console.log('');
