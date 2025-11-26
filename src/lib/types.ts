export interface Player {
  id: number;
  name: string;
  money: number;
  current_arena_level: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface MonsterType {
  id: number;
  name: string;
  description: string;
  base_hp: number;
  base_attack: number;
  base_defense: number;
  base_speed: number;
  price: number;
  image_url: string;
  is_boss: boolean;
}

export interface PlayerMonster {
  id: number;
  player_id: number;
  monster_type_id: number;
  nickname: string;
  level: number;
  hp: number;
  max_hp: number;
  attack: number;
  defense: number;
  speed: number;
  experience: number;
  training_count: number;
  is_active: boolean;
  is_training: boolean;
  training_end_time: Date | null;
  monster_type?: MonsterType;
}

export interface ArenaOpponent {
  id: number;
  level: number;
  monster_type_id: number;
  monster_level: number;
  reward_money: number;
  is_boss: boolean;
  monster_type?: MonsterType;
}

export interface CombatLog {
  id: string;
  message: string;
  type: 'info' | 'attack' | 'damage' | 'victory' | 'defeat';
  timestamp: number;
}

export interface CombatState {
  playerMonster: PlayerMonster;
  opponentMonster: {
    type: MonsterType;
    level: number;
    hp: number;
    max_hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  turn: 'player' | 'opponent';
  logs: CombatLog[];
  isFinished: boolean;
  winner?: 'player' | 'opponent';
}

export interface TrainingStat {
  name: string;
  cost: number;
  improvement: number;
  label: string;
}
