import type { Monster, Player, CombatLog } from "@/types/game"

// In-memory game state (will be replaced with database in production)
export const gameState = {
  players: new Map<string, Player>(),
  monsters: new Map<string, Monster>(),
  combatLogs: [] as CombatLog[],
}

const DEFAULT_MONSTERS: Monster[] = [
  {
    id: "dragon-fire",
    name: "Dragon de Feu",
    type: "dragon",
    level: 1,
    health: 100,
    maxHealth: 100,
    stats: { attack: 18, defense: 12, speed: 14, hp: 100 },
    mood: "happy",
    image: "/images/dragon-fire.svg",
    cost: 0,
  },
  {
    id: "knight-ice",
    name: "Chevalier de Glace",
    type: "knight",
    level: 1,
    health: 110,
    maxHealth: 110,
    stats: { attack: 14, defense: 16, speed: 10, hp: 110 },
    mood: "neutral",
    image: "/images/knight-ice.svg",
    cost: 100,
  },
  {
    id: "goblin-swift",
    name: "Gobelin Rapide",
    type: "goblin",
    level: 1,
    health: 70,
    maxHealth: 70,
    stats: { attack: 12, defense: 8, speed: 20, hp: 70 },
    mood: "angry",
    image: "/images/goblin-swift.svg",
    cost: 80,
  },
  {
    id: "phoenix-mystic",
    name: "Phénix Mystique",
    type: "phoenix",
    level: 1,
    health: 90,
    maxHealth: 90,
    stats: { attack: 16, defense: 14, speed: 16, hp: 90 },
    mood: "happy",
    image: "/images/phoenix-mystic.svg",
    cost: 150,
  },
  {
    id: "beast-titan",
    name: "Bête Titan",
    type: "beast",
    level: 1,
    health: 120,
    maxHealth: 120,
    stats: { attack: 20, defense: 10, speed: 8, hp: 120 },
    mood: "angry",
    image: "/images/beast-titan.svg",
    cost: 120,
  },
]

const ARENA_BOSSES: Monster[] = [
  {
    id: "boss-tier1",
    name: "Gorgone de Tier 1",
    type: "boss",
    level: 3,
    health: 150,
    maxHealth: 150,
    stats: { attack: 22, defense: 15, speed: 12, hp: 150 },
    mood: "angry",
    image: "/images/gorgon-boss.svg",
    cost: 0,
  },
  {
    id: "boss-tier2",
    name: "Liche de Tier 2",
    type: "boss",
    level: 6,
    health: 200,
    maxHealth: 200,
    stats: { attack: 26, defense: 18, speed: 14, hp: 200 },
    mood: "angry",
    image: "/images/lich-boss.svg",
    cost: 0,
  },
  {
    id: "boss-tier3",
    name: "Dragon Noir de Tier 3",
    type: "boss",
    level: 9,
    health: 250,
    maxHealth: 250,
    stats: { attack: 30, defense: 20, speed: 16, hp: 250 },
    mood: "angry",
    image: "/images/dark-dragon-boss.svg",
    cost: 0,
  },
  {
    id: "boss-tier4",
    name: "Démon de Tier 4",
    type: "boss",
    level: 12,
    health: 300,
    maxHealth: 300,
    stats: { attack: 34, defense: 22, speed: 18, hp: 300 },
    mood: "angry",
    image: "/images/demon-boss.svg",
    cost: 0,
  },
  {
    id: "boss-tier5",
    name: "Seigneur Abyssal de Tier 5",
    type: "boss",
    level: 15,
    health: 350,
    maxHealth: 350,
    stats: { attack: 40, defense: 25, speed: 20, hp: 350 },
    mood: "angry",
    image: "/images/abyss-lord-boss.svg",
    cost: 0,
  },
]

export function initializePlayer(playerId: string): Player {
  if (gameState.players.has(playerId)) {
    return gameState.players.get(playerId)!
  }

  const player: Player = {
    money: 500,
    ownedMonsters: ["dragon-fire"],
    nextArenaTier: 1,
    totalBattles: 0,
    wins: 0,
  }

  gameState.players.set(playerId, player)

  // Initialize default monsters in the game
  DEFAULT_MONSTERS.forEach((m) => {
    if (!gameState.monsters.has(m.id)) {
      gameState.monsters.set(m.id, { ...m })
    }
  })

  // Initialize boss monsters
  ARENA_BOSSES.forEach((b) => {
    if (!gameState.monsters.has(b.id)) {
      gameState.monsters.set(b.id, { ...b })
    }
  })

  return player
}

export function getPlayer(playerId: string): Player | null {
  return gameState.players.get(playerId) || null
}

export function getMonster(monsterId: string): Monster | null {
  return gameState.monsters.get(monsterId) || null
}

export function getOwnedMonsters(playerId: string): Monster[] {
  const player = getPlayer(playerId)
  if (!player) return []
  return player.ownedMonsters.map((id) => getMonster(id)).filter((m) => m !== null) as Monster[]
}

export function getNextOpponent(playerId: string, battleNumber: number): Monster {
  const player = getPlayer(playerId)
  if (!player) throw new Error("Player not found")

  const tierIndex = player.nextArenaTier - 1
  const isBossBattle = battleNumber % 5 === 0

  if (isBossBattle) {
    return { ...ARENA_BOSSES[tierIndex] }
  }

  // Regular enemy with stats scaled by tier
  const baseMonster = DEFAULT_MONSTERS[battleNumber % DEFAULT_MONSTERS.length]
  const scaleFactor = 1 + tierIndex * 0.4

  return {
    ...baseMonster,
    id: `enemy-${battleNumber}`,
    level: baseMonster.level + tierIndex * 2,
    health: Math.floor(baseMonster.maxHealth * scaleFactor),
    maxHealth: Math.floor(baseMonster.maxHealth * scaleFactor),
    stats: {
      attack: Math.floor(baseMonster.stats.attack * scaleFactor),
      defense: Math.floor(baseMonster.stats.defense * scaleFactor),
      speed: Math.floor(baseMonster.stats.speed * scaleFactor),
      hp: Math.floor(baseMonster.stats.hp * scaleFactor),
    },
  }
}

export function buyMonster(playerId: string, monsterId: string): boolean {
  const player = getPlayer(playerId)
  const monster = getMonster(monsterId)

  if (!player || !monster) return false
  if (monster.cost === 0) return false // Can't buy boss monsters
  if (player.money < monster.cost) return false

  player.money -= monster.cost
  if (!player.ownedMonsters.includes(monsterId)) {
    player.ownedMonsters.push(monsterId)
  }

  return true
}

export function trainMonster(playerId: string, monsterId: string): boolean {
  const player = getPlayer(playerId)
  const monster = getMonster(monsterId)

  if (!player || !monster) return false
  if (!player.ownedMonsters.includes(monsterId)) return false
  if (player.money < 20) return false

  player.money -= 20

  // Improve monster stats
  monster.stats.attack = Math.floor(monster.stats.attack * 1.05)
  monster.stats.defense = Math.floor(monster.stats.defense * 1.05)
  monster.stats.speed = Math.floor(monster.stats.speed * 1.05)
  monster.stats.hp = Math.floor(monster.stats.hp * 1.08)
  monster.level += 1
  monster.maxHealth = monster.stats.hp
  monster.health = monster.maxHealth

  return true
}

export function calculateDamage(attacker: Monster, defender: Monster): { damage: number; isCritical: boolean } {
  const baseAttack = attacker.stats.attack
  const baseDefense = defender.stats.defense
  const speedBonus = (attacker.stats.speed - defender.stats.speed) * 0.5

  const variance = Math.random() * 0.3 + 0.85 // 85-115% variance
  let damage = Math.floor((baseAttack * 0.6 + speedBonus) * variance)

  const defensionReduction = baseDefense * 0.3
  damage = Math.max(5, damage - defensionReduction)

  const isCritical = Math.random() < 0.15 // 15% critical chance
  if (isCritical) {
    damage = Math.floor(damage * 1.5)
  }

  return { damage, isCritical }
}

export function updatePlayerProgress(playerId: string, won: boolean, tierBattle: number): number {
  const player = getPlayer(playerId)
  if (!player) return 0

  player.totalBattles += 1

  let reward = 0
  if (won) {
    player.wins += 1

    const isBoss = tierBattle % 5 === 0
    const basReward = 10 + (player.nextArenaTier - 1) * 5
    reward = isBoss ? basReward * 5 : basReward

    player.money += reward

    // Progress to next tier after 5 wins per tier
    if (player.wins % 5 === 0 && player.nextArenaTier < 5) {
      player.nextArenaTier += 1
    }
  }

  return reward
}

export function getShopMonsters(): Monster[] {
  return DEFAULT_MONSTERS.filter((m) => m.cost > 0)
}
