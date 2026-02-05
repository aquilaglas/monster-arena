import fs from 'fs';
import path from 'path';

const monstersDir = path.join(process.cwd(), 'static', 'monsters');

// Ensure directory exists
if (!fs.existsSync(monstersDir)) {
  fs.mkdirSync(monstersDir, { recursive: true });
}

// Pixel art grid helper
function createPixelGrid(pixels, cellSize = 10) {
  return pixels.map((row, y) =>
    row.map((color, x) =>
      color ? `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="${color}"/>` : ''
    ).join('\n')
  ).join('\n');
}

// Create outline around the monster
function createOutline(pixels, cellSize = 10) {
  const lines = [];
  const height = pixels.length;
  const width = pixels[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[y][x]) {
        // Check top
        if (y === 0 || !pixels[y - 1][x]) {
          lines.push(`<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="1" fill="black"/>`);
        }
        // Check bottom
        if (y === height - 1 || !pixels[y + 1][x]) {
          lines.push(`<rect x="${x * cellSize}" y="${(y + 1) * cellSize - 1}" width="${cellSize}" height="1" fill="black"/>`);
        }
        // Check left
        if (x === 0 || !pixels[y][x - 1]) {
          lines.push(`<rect x="${x * cellSize}" y="${y * cellSize}" width="1" height="${cellSize}" fill="black"/>`);
        }
        // Check right
        if (x === width - 1 || !pixels[y][x + 1]) {
          lines.push(`<rect x="${(x + 1) * cellSize - 1}" y="${y * cellSize}" width="1" height="${cellSize}" fill="black"/>`);
        }
      }
    }
  }

  return lines.join('\n');
}

// Monster designs (16x16 pixel grid)
const monsters = {
  aqualis: {
    colors: { body: '#4A90E2', belly: '#87CEEB', eye: '#FFFFFF', pupil: '#000000', fin: '#2E5F8E' },
    pixels: [
      [0,0,0,0,0,0,'fin','fin','fin','fin',0,0,0,0,0,0],
      [0,0,0,0,'fin','fin','body','body','body','body','fin','fin',0,0,0,0],
      [0,0,0,'fin','body','body','body','body','body','body','body','body','fin',0,0,0],
      [0,0,'fin','body','body','eye','eye','body','body','eye','eye','body','body','fin',0,0],
      [0,0,'body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','body',0,0],
      [0,'fin','body','body','body','body','body','body','body','body','body','body','body','body','fin',0],
      [0,'body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body',0],
      [0,'body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body',0],
      [0,'body','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','body',0],
      [0,0,'body','body','body','body','body','body','body','body','body','body','body','body',0,0],
      [0,0,'fin','body','body','body','body','body','body','body','body','body','body','fin',0,0],
      [0,'fin','fin','fin','body','body','body','body','body','body','body','body','fin','fin','fin',0],
      [0,'fin','fin',0,'fin','fin','body','body','body','body','fin','fin',0,'fin','fin',0],
      [0,'fin',0,0,0,'fin','fin','body','body','fin','fin',0,0,0,'fin',0],
      [0,0,0,0,0,0,'fin','fin','fin','fin',0,0,0,0,0,0],
      [0,0,0,0,0,0,0,'fin','fin',0,0,0,0,0,0,0]
    ]
  },

  flammy: {
    colors: { body: '#FF6B35', belly: '#FFB84D', eye: '#FFFFFF', pupil: '#000000', flame: '#FF4500', flame2: '#FFA500' },
    pixels: [
      [0,0,0,0,'flame2','flame','flame','flame2',0,0,0,0,0,0,0,0],
      [0,0,0,'flame','flame2','flame','body','body','flame2',0,0,0,0,0,0,0],
      [0,0,'flame','flame2','body','body','body','body','body','flame',0,0,0,0,0,0],
      [0,0,'body','body','body','eye','eye','body','body','body','body',0,0,0,0,0],
      [0,0,'body','body','eye','pupil','eye','body','body','eye','eye','body',0,0,0,0],
      [0,0,'body','body','body','body','body','body','eye','pupil','eye','body',0,0,0,0],
      [0,0,'body','belly','belly','belly','body','body','body','body','body','body',0,0,0,0],
      [0,0,'body','belly','belly','belly','belly','body','body','body','body','body',0,0,0,0],
      [0,0,'body','body','belly','belly','belly','belly','body','body','body','body',0,0,0,0],
      [0,0,0,'body','body','belly','belly','body','body','body','body',0,0,0,0,0],
      [0,0,0,'body','body','body','body','body','body','body','body',0,0,0,0,0],
      [0,0,0,'flame','body','body','body','body','body','body','flame',0,0,0,0,0],
      [0,0,'flame','flame2','flame','body','body','body','body','flame','flame2','flame',0,0,0,0],
      [0,0,'flame2','flame',0,'flame','body','body','flame',0,'flame','flame2',0,0,0,0],
      [0,0,0,0,0,0,'flame','flame',0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  },

  voltix: {
    colors: { body: '#FFD700', belly: '#FFFF00', eye: '#FFFFFF', pupil: '#000000', bolt: '#FFA500', bolt2: '#FFFF66' },
    pixels: [
      [0,0,0,'bolt2','bolt',0,0,0,0,0,'bolt','bolt2',0,0,0,0],
      [0,0,'bolt','bolt2','body','bolt',0,0,0,'bolt','body','bolt','bolt2',0,0,0],
      [0,0,'body','body','body','body','bolt',0,'bolt','body','body','body','body',0,0,0],
      [0,0,'body','body','eye','eye','body','bolt','body','eye','eye','body','body',0,0,0],
      [0,0,'body','eye','pupil','eye','body','body','body','eye','pupil','eye','body',0,0,0],
      [0,0,'body','body','body','body','body','body','body','body','body','body','body',0,0,0],
      [0,0,'body','belly','belly','belly','belly','body','belly','belly','belly','belly','body',0,0,0],
      [0,0,'body','belly','belly','belly','belly','belly','belly','belly','belly','belly','body',0,0,0],
      [0,0,'body','body','belly','belly','belly','belly','belly','belly','belly','body','body',0,0,0],
      [0,0,0,'body','body','body','belly','belly','belly','body','body','body',0,0,0,0],
      [0,'bolt',0,'body','body','body','body','body','body','body','body',0,'bolt2',0,0,0],
      [0,'bolt2','bolt','body','body','body','body','body','body','body','bolt','bolt2',0,0,0,0],
      [0,0,'bolt','bolt2','body','body','body','body','body','bolt2','bolt',0,0,0,0,0],
      [0,0,0,'bolt','bolt2','body','body','body','bolt2','bolt',0,0,0,0,0,0],
      [0,0,0,0,'bolt','bolt2','body','bolt2','bolt',0,0,0,0,0,0,0],
      [0,0,0,0,0,'bolt','bolt2','bolt',0,0,0,0,0,0,0,0]
    ]
  },

  terros: {
    colors: { body: '#8B4513', rock: '#A0522D', belly: '#CD853F', eye: '#FFFFFF', pupil: '#000000', dark: '#654321' },
    pixels: [
      [0,0,0,0,'rock','rock','rock','rock','rock','rock',0,0,0,0,0,0],
      [0,0,0,'rock','dark','body','body','body','body','dark','rock',0,0,0,0,0],
      [0,0,'rock','body','body','body','body','body','body','body','body','rock',0,0,0,0],
      [0,0,'body','body','eye','eye','body','body','eye','eye','body','body',0,0,0,0],
      [0,'rock','body','eye','pupil','eye','body','body','eye','pupil','eye','body','rock',0,0,0],
      [0,'body','body','body','body','body','body','body','body','body','body','body','body',0,0,0],
      ['rock','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','rock',0,0],
      ['rock','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','rock',0,0],
      [0,'body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body',0,0,0],
      [0,'rock','body','body','body','belly','belly','belly','belly','body','body','body','rock',0,0,0],
      [0,0,'rock','body','body','body','body','body','body','body','body','rock',0,0,0,0],
      [0,0,'rock','rock','body','body','body','body','body','body','rock','rock',0,0,0,0],
      [0,'rock','dark','rock','rock','body','body','body','body','rock','rock','dark','rock',0,0,0],
      [0,'rock','rock',0,0,'rock','body','body','rock',0,0,'rock','rock',0,0,0],
      [0,0,0,0,0,0,'rock','rock',0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  },

  glacior: {
    colors: { body: '#B0E0E6', ice: '#E0FFFF', belly: '#FFFFFF', eye: '#ADD8E6', pupil: '#4682B4', crystal: '#87CEEB' },
    pixels: [
      [0,0,0,'crystal',0,0,0,0,0,0,'crystal',0,0,0,0,0],
      [0,0,'crystal','ice','crystal',0,0,0,0,'crystal','ice','crystal',0,0,0,0],
      [0,0,'ice','body','body','crystal',0,0,'crystal','body','body','ice',0,0,0,0],
      [0,'crystal','body','body','eye','eye','crystal','crystal','eye','eye','body','body','crystal',0,0,0],
      [0,'ice','body','eye','pupil','eye','body','body','eye','pupil','eye','body','ice',0,0,0],
      [0,'body','body','body','body','body','body','body','body','body','body','body','body',0,0,0],
      [0,'body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body',0,0,0],
      [0,'body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body',0,0,0],
      [0,'ice','body','belly','belly','belly','belly','belly','belly','belly','belly','body','ice',0,0,0],
      [0,0,'body','body','body','belly','belly','belly','belly','body','body','body',0,0,0,0],
      [0,0,'crystal','body','body','body','body','body','body','body','body','crystal',0,0,0,0],
      [0,'crystal','ice','crystal','body','body','body','body','body','body','crystal','ice','crystal',0,0,0],
      [0,'ice','crystal',0,'crystal','body','body','body','body','crystal',0,'crystal','ice',0,0,0],
      [0,'crystal',0,0,0,'crystal','ice','ice','crystal',0,0,0,'crystal',0,0,0],
      [0,0,0,0,0,0,'crystal','crystal',0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  },

  venomfang: {
    colors: { body: '#9370DB', belly: '#BA55D3', eye: '#FF0000', pupil: '#000000', fang: '#FFFFFF', poison: '#8B008B' },
    pixels: [
      [0,0,0,0,0,'poison','poison','poison','poison',0,0,0,0,0,0,0],
      [0,0,0,0,'poison','body','body','body','body','poison',0,0,0,0,0,0],
      [0,0,0,'poison','body','body','body','body','body','body','poison',0,0,0,0,0],
      [0,0,'poison','body','body','eye','eye','body','body','eye','eye','poison',0,0,0,0],
      [0,0,'body','body','eye','pupil','eye','body','body','eye','pupil','eye','body',0,0,0],
      [0,'poison','body','body','body','body','body','body','body','body','body','body','body','poison',0,0],
      [0,'body','belly','belly','fang','body','body','body','body','fang','belly','belly','belly','body',0,0],
      [0,'body','belly','belly','fang','fang','body','body','fang','fang','belly','belly','belly','body',0,0],
      [0,'body','body','belly','belly','body','body','body','body','belly','belly','belly','body','body',0,0],
      [0,0,'body','body','body','body','body','body','body','body','body','body','body',0,0,0],
      [0,0,'poison','body','body','body','body','body','body','body','body','body','poison',0,0,0],
      [0,0,'poison','poison','body','body','body','body','body','body','body','poison','poison',0,0,0],
      [0,'poison','body','poison','poison','body','body','body','body','poison','poison','body','poison',0,0,0],
      [0,'poison',0,0,'poison','poison','body','body','poison','poison',0,0,'poison',0,0,0],
      [0,0,0,0,0,'poison','poison','poison','poison',0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]
  },

  shadowclaw: {
    colors: { body: '#2C2C2C', dark: '#000000', belly: '#4A4A4A', eye: '#FF0000', pupil: '#8B0000', claw: '#696969' },
    pixels: [
      [0,0,0,'claw',0,0,0,0,0,0,0,'claw',0,0,0,0],
      [0,0,'claw','dark','claw',0,0,0,0,0,'claw','dark','claw',0,0,0],
      [0,'claw','dark','body','body','dark',0,0,0,'dark','body','body','dark','claw',0,0],
      [0,'dark','body','body','eye','eye','dark','dark','eye','eye','body','body','dark',0,0,0],
      [0,'body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','body',0,0,0],
      ['dark','body','body','body','body','body','body','body','body','body','body','body','body','dark',0,0],
      ['dark','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','dark',0,0],
      ['dark','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','dark',0,0],
      [0,'body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body',0,0,0],
      [0,'dark','body','body','body','belly','belly','belly','belly','body','body','body','dark',0,0,0],
      [0,'claw','dark','body','body','body','body','body','body','body','body','dark','claw',0,0,0],
      ['claw','dark','claw','dark','body','body','body','body','body','body','dark','claw','dark','claw',0,0],
      ['dark','claw',0,'dark','claw','body','body','body','body','claw','dark',0,'claw','dark',0,0],
      ['claw',0,0,0,'dark','claw','body','body','claw','dark',0,0,0,'claw',0,0],
      [0,0,0,0,0,'dark','claw','claw','dark',0,0,0,0,0,0,0],
      [0,0,0,0,0,0,'dark','dark',0,0,0,0,0,0,0,0]
    ]
  },

  luminos: {
    colors: { body: '#FFD700', light: '#FFFF00', belly: '#FFF8DC', eye: '#FFFFFF', pupil: '#FFD700', glow: '#FFFFE0' },
    pixels: [
      [0,'glow',0,0,0,'light','light','light','light',0,0,0,'glow',0,0,0],
      ['glow','light','glow',0,'light','body','body','body','body','light',0,'glow','light','glow',0,0],
      [0,'glow','light','light','body','body','body','body','body','body','light','light','glow',0,0,0],
      [0,0,'light','body','body','eye','eye','body','body','eye','eye','body','light',0,0,0],
      [0,'glow','body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','glow',0,0],
      ['glow','light','body','body','body','body','body','body','body','body','body','body','body','light','glow',0],
      ['light','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','light',0,0],
      ['light','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','light',0,0],
      ['glow','body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body','glow',0,0],
      [0,'light','body','body','body','belly','belly','belly','belly','body','body','body','light',0,0,0],
      [0,'glow','light','body','body','body','body','body','body','body','body','light','glow',0,0,0],
      ['glow','light','glow','light','body','body','body','body','body','body','light','glow','light','glow',0,0],
      [0,'glow',0,'glow','light','body','body','body','body','light','glow',0,'glow',0,0,0],
      [0,0,0,0,'glow','light','body','body','light','glow',0,0,0,0,0,0],
      [0,0,0,0,0,'glow','light','light','glow',0,0,0,0,0,0,0],
      [0,0,0,0,0,0,'glow','glow',0,0,0,0,0,0,0,0]
    ]
  },

  crystallia: {
    colors: { body: '#DA70D6', crystal: '#EE82EE', belly: '#FFB6C1', eye: '#FFFFFF', pupil: '#9932CC', shard: '#FF00FF' },
    pixels: [
      [0,0,'shard',0,0,0,'crystal','crystal',0,0,0,'shard',0,0,0,0],
      [0,'shard','crystal','shard',0,'crystal','body','body','crystal',0,'shard','crystal','shard',0,0,0],
      [0,'crystal','body','crystal','crystal','body','body','body','body','crystal','crystal','body','crystal',0,0,0],
      [0,0,'body','body','eye','eye','body','body','eye','eye','body','body',0,0,0,0],
      [0,'crystal','body','eye','pupil','eye','body','body','eye','pupil','eye','body','crystal',0,0,0],
      [0,'body','body','body','body','body','body','body','body','body','body','body','body',0,0,0],
      ['crystal','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','crystal',0,0],
      ['crystal','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','crystal',0,0],
      [0,'body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body',0,0,0],
      [0,'crystal','body','body','body','belly','belly','belly','belly','body','body','body','crystal',0,0,0],
      [0,'shard','crystal','body','body','body','body','body','body','body','body','crystal','shard',0,0,0],
      ['shard','crystal','shard','crystal','body','body','body','body','body','body','crystal','shard','crystal','shard',0,0],
      ['crystal','shard',0,'shard','crystal','body','body','body','body','crystal','shard',0,'shard','crystal',0,0],
      ['shard',0,0,0,'shard','crystal','body','body','crystal','shard',0,0,0,'shard',0,0],
      [0,0,0,0,0,'shard','crystal','crystal','shard',0,0,0,0,0,0,0],
      [0,0,0,0,0,0,'shard','shard',0,0,0,0,0,0,0,0]
    ]
  },

  zephyr: {
    colors: { body: '#87CEEB', cloud: '#F0F8FF', belly: '#E6F2FF', eye: '#FFFFFF', pupil: '#4682B4', wind: '#B0E0E6' },
    pixels: [
      ['wind','wind',0,0,0,0,'cloud','cloud',0,0,'wind','wind',0,0,0,0],
      ['cloud','wind','wind',0,0,'cloud','body','body','cloud',0,'wind','cloud','wind',0,0,0],
      [0,'wind','cloud','wind','cloud','body','body','body','body','cloud','cloud','wind','cloud',0,0,0],
      [0,0,'cloud','body','body','eye','eye','body','body','eye','eye','body','cloud',0,0,0],
      [0,'wind','body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','wind',0,0],
      ['wind','cloud','body','body','body','body','body','body','body','body','body','body','body','cloud',0,0],
      ['cloud','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','wind',0,0],
      ['wind','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','cloud',0,0],
      [0,'body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body','wind',0,0],
      [0,'cloud','body','body','body','belly','belly','belly','belly','body','body','body','cloud',0,0,0],
      ['wind','cloud','wind','body','body','body','body','body','body','body','body','wind','cloud',0,0,0],
      ['cloud','wind','cloud','wind','body','body','body','body','body','body','cloud','wind','wind','cloud',0,0],
      ['wind','cloud',0,'wind','cloud','body','body','body','body','wind','wind',0,'cloud','wind',0,0],
      [0,'wind',0,0,'wind','cloud','body','body','wind','wind',0,0,'wind',0,0,0],
      [0,0,0,0,0,'wind','cloud','wind','wind',0,0,0,0,0,0,0],
      [0,0,0,0,0,0,'wind','wind',0,0,0,0,0,0,0,0]
    ]
  },

  infernus: {
    colors: { body: '#8B0000', flame: '#FF4500', belly: '#DC143C', eye: '#FFA500', pupil: '#000000', horn: '#2C0000' },
    pixels: [
      [0,0,'horn','horn',0,0,0,0,0,0,'horn','horn',0,0,0,0],
      [0,'horn','flame','horn',0,0,0,0,0,0,'horn','flame','horn',0,0,0],
      [0,'flame','body','horn','flame',0,0,0,0,'flame','horn','body','flame',0,0,0],
      [0,'horn','body','body','flame','flame',0,0,'flame','flame','body','body','horn',0,0,0],
      [0,'body','body','eye','eye','body','flame','flame','body','eye','eye','body','body',0,0,0],
      ['flame','body','eye','pupil','eye','body','body','body','body','eye','pupil','eye','body','flame',0,0],
      ['flame','body','body','body','body','body','body','body','body','body','body','body','body','flame',0,0],
      ['horn','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','horn',0,0],
      ['flame','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','flame',0,0],
      ['flame','body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body','flame',0,0],
      [0,'flame','body','body','body','belly','belly','belly','belly','body','body','body','flame',0,0,0],
      [0,'flame','flame','body','body','body','body','body','body','body','body','flame','flame',0,0,0],
      [0,'flame','horn','flame','body','body','body','body','body','body','flame','horn','flame',0,0,0],
      [0,0,'flame','horn','flame','body','body','body','body','flame','horn','flame',0,0,0,0],
      [0,0,0,'flame','horn','flame','body','body','flame','horn','flame',0,0,0,0,0],
      [0,0,0,0,'flame','horn','flame','flame','horn','flame',0,0,0,0,0,0]
    ]
  },

  titanor: {
    colors: { body: '#708090', metal: '#C0C0C0', belly: '#A9A9A9', eye: '#00FFFF', pupil: '#000000', dark: '#2F4F4F' },
    pixels: [
      [0,0,'metal','metal','metal',0,0,0,0,'metal','metal','metal',0,0,0,0],
      [0,'metal','dark','body','metal','metal',0,0,'metal','metal','body','dark','metal',0,0,0],
      [0,'metal','body','body','body','metal','metal','metal','metal','body','body','body','metal',0,0,0],
      [0,'dark','body','body','eye','eye','metal','metal','eye','eye','body','body','dark',0,0,0],
      [0,'body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','body',0,0,0],
      ['metal','body','body','body','body','body','body','body','body','body','body','body','body','metal',0,0],
      ['metal','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','metal',0,0],
      ['dark','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','dark',0,0],
      ['metal','body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body','metal',0,0],
      [0,'metal','body','body','body','belly','belly','belly','belly','body','body','body','metal',0,0,0],
      [0,'dark','metal','body','body','body','body','body','body','body','body','metal','dark',0,0,0],
      [0,'metal','dark','metal','body','body','body','body','body','body','metal','dark','metal',0,0,0],
      ['metal','dark','metal',0,'metal','body','body','body','body','metal',0,'metal','dark','metal',0,0],
      ['metal','metal',0,0,'dark','metal','body','body','metal','dark',0,0,'metal','metal',0,0],
      [0,0,0,0,0,'metal','dark','dark','metal',0,0,0,0,0,0,0],
      [0,0,0,0,0,0,'metal','metal',0,0,0,0,0,0,0,0]
    ]
  },

  boss_leviathan: {
    colors: { body: '#000080', scale: '#1E3A8A', belly: '#4169E1', eye: '#FF0000', pupil: '#8B0000', fin: '#0F1F3F', water: '#4682B4' },
    pixels: [
      [0,0,'water','fin','fin','fin','fin','fin','fin','fin','fin','fin','water',0,0,0],
      [0,'water','fin','scale','body','body','body','body','body','body','scale','fin','water',0,0,0],
      ['water','fin','scale','body','body','body','body','body','body','body','body','scale','fin','water',0,0],
      ['fin','scale','body','body','eye','eye','body','body','eye','eye','body','body','scale','fin',0,0],
      ['fin','body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','body','fin',0,0],
      ['fin','body','body','body','body','body','body','body','body','body','body','body','body','fin',0,0],
      ['scale','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','scale',0,0],
      ['scale','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','scale',0,0],
      ['fin','body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body','fin',0,0],
      ['fin','scale','body','body','body','belly','belly','belly','belly','body','body','body','scale','fin',0,0],
      ['water','fin','scale','body','body','body','body','body','body','body','body','scale','fin','water',0,0],
      [0,'water','fin','fin','body','body','body','body','body','body','fin','fin','water',0,0,0],
      [0,'fin','water','fin','fin','body','body','body','body','fin','fin','water','fin',0,0,0],
      ['fin','water',0,'water','fin','fin','body','body','fin','fin','water',0,'water','fin',0,0],
      ['water',0,0,0,'water','fin','fin','fin','fin','water',0,0,0,'water',0,0],
      [0,0,0,0,0,'water','water','water','water',0,0,0,0,0,0,0]
    ]
  },

  boss_pyrothor: {
    colors: { body: '#B22222', flame: '#FF4500', belly: '#FF6347', eye: '#FFD700', pupil: '#000000', lava: '#FF8C00', core: '#FF0000' },
    pixels: [
      [0,'flame','lava','flame',0,0,0,0,0,0,'flame','lava','flame',0,0,0],
      ['flame','lava','core','lava','flame',0,0,0,0,'flame','lava','core','lava','flame',0,0],
      ['lava','core','body','core','lava','flame',0,0,'flame','lava','core','body','core','lava',0,0],
      ['flame','core','body','body','eye','eye','flame','flame','eye','eye','body','body','core','flame',0,0],
      ['lava','body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','body','lava',0,0],
      ['flame','body','body','body','body','body','body','body','body','body','body','body','body','flame',0,0],
      ['core','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','core',0,0],
      ['lava','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','lava',0,0],
      ['flame','body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body','flame',0,0],
      ['lava','core','body','body','body','belly','belly','belly','belly','body','body','body','core','lava',0,0],
      ['flame','lava','core','body','body','body','body','body','body','body','body','core','lava','flame',0,0],
      [0,'flame','lava','flame','body','body','body','body','body','body','flame','lava','flame',0,0,0],
      [0,'lava','core','flame','lava','body','body','body','body','lava','flame','core','lava',0,0,0],
      ['flame','core','lava',0,'flame','lava','body','body','lava','flame',0,'lava','core','flame',0,0],
      ['lava','flame',0,0,0,'flame','lava','lava','flame',0,0,0,'flame','lava',0,0],
      ['flame',0,0,0,0,0,'flame','flame',0,0,0,0,0,'flame',0,0]
    ]
  },

  boss_chronos: {
    colors: { body: '#4B0082', time: '#9370DB', belly: '#8A2BE2', eye: '#00FFFF', pupil: '#000000', gold: '#FFD700', clock: '#C0C0C0' },
    pixels: [
      [0,'gold','clock','gold',0,0,0,0,0,0,'gold','clock','gold',0,0,0],
      ['gold','clock','time','clock','gold',0,0,0,0,'gold','clock','time','clock','gold',0,0],
      ['clock','time','body','time','clock','gold',0,0,'gold','clock','time','body','time','clock',0,0],
      ['gold','time','body','body','eye','eye','gold','gold','eye','eye','body','body','time','gold',0,0],
      ['clock','body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','body','clock',0,0],
      ['gold','body','body','body','body','body','body','body','body','body','body','body','body','gold',0,0],
      ['time','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','time',0,0],
      ['clock','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','clock',0,0],
      ['gold','body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body','gold',0,0],
      ['time','clock','body','body','body','belly','belly','belly','belly','body','body','body','clock','time',0,0],
      ['gold','time','clock','body','body','body','body','body','body','body','body','clock','time','gold',0,0],
      [0,'gold','time','gold','body','body','body','body','body','body','gold','time','gold',0,0,0],
      [0,'clock','gold','time','clock','body','body','body','body','clock','time','gold','clock',0,0,0],
      ['gold','time','clock',0,'gold','clock','body','body','clock','gold',0,'clock','time','gold',0,0],
      ['clock','gold',0,0,0,'gold','clock','clock','gold',0,0,0,'gold','clock',0,0],
      ['gold',0,0,0,0,0,'gold','gold',0,0,0,0,0,'gold',0,0]
    ]
  },

  boss_stormlord: {
    colors: { body: '#2F4F4F', storm: '#708090', belly: '#778899', eye: '#FFFF00', pupil: '#000000', bolt: '#00FFFF', cloud: '#B0C4DE' },
    pixels: [
      ['bolt','cloud','bolt',0,0,0,0,0,0,0,'bolt','cloud','bolt',0,0,0],
      ['cloud','bolt','storm','bolt','cloud',0,0,0,0,'cloud','bolt','storm','bolt','cloud',0,0],
      ['bolt','storm','body','storm','bolt','cloud',0,0,'cloud','bolt','storm','body','storm','bolt',0,0],
      ['cloud','storm','body','body','eye','eye','bolt','bolt','eye','eye','body','body','storm','cloud',0,0],
      ['bolt','body','body','eye','pupil','eye','body','body','eye','pupil','eye','body','body','bolt',0,0],
      ['storm','body','body','body','body','body','body','body','body','body','body','body','body','storm',0,0],
      ['cloud','body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body','cloud',0,0],
      ['bolt','body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body','bolt',0,0],
      ['storm','body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body','storm',0,0],
      ['cloud','bolt','body','body','body','belly','belly','belly','belly','body','body','body','bolt','cloud',0,0],
      ['bolt','storm','cloud','body','body','body','body','body','body','body','body','cloud','storm','bolt',0,0],
      [0,'cloud','bolt','storm','body','body','body','body','body','body','storm','bolt','cloud',0,0,0],
      [0,'bolt','cloud','bolt','storm','body','body','body','body','storm','bolt','cloud','bolt',0,0,0],
      ['cloud','storm','bolt',0,'cloud','bolt','body','body','bolt','cloud',0,'bolt','storm','cloud',0,0],
      ['bolt','cloud',0,0,0,'cloud','bolt','bolt','cloud',0,0,0,'cloud','bolt',0,0],
      ['cloud',0,0,0,0,0,'cloud','cloud',0,0,0,0,0,'cloud',0,0]
    ]
  },

  placeholder: {
    colors: { body: '#808080', belly: '#A9A9A9', eye: '#FFFFFF', pupil: '#000000', outline: '#404040' },
    pixels: [
      [0,0,0,0,0,'outline','outline','outline','outline',0,0,0,0,0,0,0],
      [0,0,0,0,'outline','body','body','body','body','outline',0,0,0,0,0,0],
      [0,0,0,'outline','body','body','body','body','body','body','outline',0,0,0,0,0],
      [0,0,'outline','body','body','eye','eye','body','body','eye','eye','outline',0,0,0,0],
      [0,0,'body','body','eye','pupil','eye','body','body','eye','pupil','eye','body',0,0,0],
      [0,'outline','body','body','body','body','body','body','body','body','body','body','body','outline',0,0],
      [0,'body','belly','belly','belly','belly','body','body','belly','belly','belly','belly','body',0,0,0],
      [0,'body','belly','belly','belly','belly','belly','belly','belly','belly','belly','belly','body',0,0,0],
      [0,'body','body','belly','belly','belly','belly','belly','belly','belly','belly','body','body',0,0,0],
      [0,0,'body','body','body','belly','belly','belly','belly','body','body','body',0,0,0,0],
      [0,0,'outline','body','body','body','body','body','body','body','body','outline',0,0,0,0],
      [0,0,'outline','outline','body','body','body','body','body','body','outline','outline',0,0,0,0],
      [0,'outline','body','outline','outline','body','body','body','body','outline','outline','body','outline',0,0,0],
      [0,'outline',0,0,'outline','outline','body','body','outline','outline',0,0,'outline',0,0,0],
      [0,0,0,0,0,'outline','outline','outline','outline',0,0,0,0,0,0,0],
      [0,0,0,0,0,0,'outline','outline',0,0,0,0,0,0,0,0]
    ]
  }
};

// Generate SVGs
Object.entries(monsters).forEach(([name, data]) => {
  const processedPixels = data.pixels.map(row =>
    row.map(cell => cell === 0 ? null : (data.colors[cell] || cell))
  );

  const pixelGrid = createPixelGrid(processedPixels, 10);
  const outline = createOutline(processedPixels, 10);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <rect width="160" height="160" fill="transparent"/>
  ${pixelGrid}
  ${outline}
</svg>`;

  const filePath = path.join(monstersDir, `${name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Generated ${name}.svg`);
});

console.log(`\n✨ Successfully generated ${Object.keys(monsters).length} monster sprites!`);
