export interface MonsterStats {
  attack: number
  defense: number
  speed: number
  hp: number
}

export interface Monster {
  id: string
  name: string
  type: string
  level: number
  health: number
  maxHealth: number
  stats: MonsterStats
  mood: "happy" | "neutral" | "angry"
  image: string
  cost: number
}

export interface CombatLog {
  id: string
  attackerMonsterId: string
  defenderMonsterId: string
  action: "attack" | "defend"
  damage: number
  result: "hit" | "miss" | "critical"
  reward: number
  timestamp: number
}

export interface Player {
  money: number
  ownedMonsters: string[]
  nextArenaTier: number
  totalBattles: number
  wins: number
}
