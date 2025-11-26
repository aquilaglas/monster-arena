import type { CombatState, PlayerMonster, ArenaOpponent, CombatLog } from '$lib/types';

export function initializeCombat(
  playerMonster: PlayerMonster,
  opponent: ArenaOpponent
): CombatState {
  const opponentStats = calculateMonsterStats(
    opponent.monster_type!,
    opponent.monster_level
  );

  return {
    playerMonster: { ...playerMonster },
    opponentMonster: {
      type: opponent.monster_type!,
      level: opponent.monster_level,
      hp: opponentStats.hp,
      max_hp: opponentStats.hp,
      attack: opponentStats.attack,
      defense: opponentStats.defense,
      speed: opponentStats.speed,
    },
    turn: playerMonster.speed >= opponentStats.speed ? 'player' : 'opponent',
    logs: [
      {
        id: crypto.randomUUID(),
        message: `Combat contre ${opponent.monster_type!.name} niveau ${opponent.monster_level} !`,
        type: 'info',
        timestamp: Date.now(),
      },
    ],
    isFinished: false,
  };
}

function calculateMonsterStats(
  monsterType: any,
  level: number
): { hp: number; attack: number; defense: number; speed: number } {
  const multiplier = 1 + (level - 1) * 0.1;
  return {
    hp: Math.floor(monsterType.base_hp * multiplier),
    attack: Math.floor(monsterType.base_attack * multiplier),
    defense: Math.floor(monsterType.base_defense * multiplier),
    speed: Math.floor(monsterType.base_speed * multiplier),
  };
}

export function executeTurn(state: CombatState, action: 'attack'): CombatState {
  const newState = { ...state };
  const newLogs: CombatLog[] = [...state.logs];

  if (state.turn === 'player') {
    const damage = calculateDamage(
      newState.playerMonster.attack,
      newState.opponentMonster.defense
    );
    newState.opponentMonster.hp = Math.max(0, newState.opponentMonster.hp - damage);

    newLogs.push({
      id: crypto.randomUUID(),
      message: `${newState.playerMonster.nickname} attaque et inflige ${damage} dégâts !`,
      type: 'attack',
      timestamp: Date.now(),
    });

    if (newState.opponentMonster.hp === 0) {
      newState.isFinished = true;
      newState.winner = 'player';
      newLogs.push({
        id: crypto.randomUUID(),
        message: `Victoire ! ${newState.playerMonster.nickname} a gagné le combat !`,
        type: 'victory',
        timestamp: Date.now(),
      });
    } else {
      newState.turn = 'opponent';
    }
  } else {
    const damage = calculateDamage(
      newState.opponentMonster.attack,
      newState.playerMonster.defense
    );
    newState.playerMonster.hp = Math.max(0, newState.playerMonster.hp - damage);

    newLogs.push({
      id: crypto.randomUUID(),
      message: `${newState.opponentMonster.type.name} attaque et inflige ${damage} dégâts !`,
      type: 'damage',
      timestamp: Date.now(),
    });

    if (newState.playerMonster.hp === 0) {
      newState.isFinished = true;
      newState.winner = 'opponent';
      newLogs.push({
        id: crypto.randomUUID(),
        message: `Défaite... ${newState.playerMonster.nickname} est K.O.`,
        type: 'defeat',
        timestamp: Date.now(),
      });
    } else {
      newState.turn = 'player';
    }
  }

  newState.logs = newLogs;
  return newState;
}

function calculateDamage(attack: number, defense: number): number {
  const baseDamage = attack - defense * 0.5;
  const variance = Math.random() * 0.2 + 0.9; // 90% à 110%
  return Math.max(5, Math.floor(baseDamage * variance));
}
