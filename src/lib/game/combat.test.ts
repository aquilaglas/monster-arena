import { describe, it, expect } from 'vitest';
import { initializeCombat, executeTurn } from './combat';

describe('Combat System', () => {
  it('should initialize combat state correctly', () => {
    const playerMonster: any = {
      id: 1,
      nickname: 'Test Monster',
      hp: 100,
      max_hp: 100,
      attack: 50,
      defense: 30,
      speed: 60,
      level: 5,
    };

    const opponent: any = {
      level: 1,
      monster_level: 1,
      monster_type: {
        name: 'Enemy',
        base_hp: 80,
        base_attack: 40,
        base_defense: 25,
        base_speed: 50,
      },
    };

    const combat = initializeCombat(playerMonster, opponent);

    expect(combat).toBeDefined();
    expect(combat.playerMonster).toEqual(playerMonster);
    expect(combat.turn).toBe('player'); // Player is faster
    expect(combat.isFinished).toBe(false);
  });

  it('should execute attack turn', () => {
    const combat: any = {
      playerMonster: {
        nickname: 'Test',
        hp: 100,
        max_hp: 100,
        attack: 50,
        defense: 30,
        speed: 60,
      },
      opponentMonster: {
        type: { name: 'Enemy' },
        hp: 80,
        max_hp: 80,
        attack: 40,
        defense: 25,
        speed: 50,
      },
      turn: 'player',
      logs: [],
      isFinished: false,
    };

    const newState = executeTurn(combat, 'attack');

    expect(newState.opponentMonster.hp).toBeLessThan(80);
    expect(newState.logs.length).toBeGreaterThan(0);
  });
});
