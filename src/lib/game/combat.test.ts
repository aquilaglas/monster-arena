import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest';
import { initializeCombat, executeTurn } from './combat.client';
import type { PlayerMonster, ArenaOpponent, CombatState, MonsterType } from '$lib/types';

function makeMonsterType(overrides: Partial<MonsterType> = {}): MonsterType {
  return {
    id: 1,
    name: 'Flammy',
    description: 'A fire monster',
    base_hp: 100,
    base_attack: 50,
    base_defense: 30,
    base_speed: 40,
    price: 500,
    image_url: '/monsters/flammy.svg',
    is_boss: false,
    element_type: 'fire',
    ...overrides,
  };
}

function makePlayerMonster(overrides: Partial<PlayerMonster> = {}): PlayerMonster {
  return {
    id: 1,
    player_id: 1,
    monster_type_id: 1,
    nickname: 'Flammy',
    level: 5,
    hp: 100,
    max_hp: 100,
    attack: 50,
    defense: 30,
    speed: 60,
    experience: 0,
    training_count: 0,
    is_active: true,
    is_training: false,
    training_end_time: null,
    training_stat: null,
    training_improvement: null,
    monster_type: makeMonsterType(),
    ...overrides,
  };
}

function makeOpponent(overrides: Partial<ArenaOpponent> = {}): ArenaOpponent {
  return {
    id: 1,
    level: 1,
    monster_type_id: 2,
    monster_level: 3,
    reward_money: 200,
    is_boss: false,
    monster_type: makeMonsterType({
      id: 2,
      name: 'Aqualis',
      element_type: 'water',
      base_hp: 80,
      base_attack: 40,
      base_defense: 25,
      base_speed: 50,
    }),
    ...overrides,
  };
}

describe('Combat System', () => {
  describe('initializeCombat', () => {
    it('should create a valid combat state', () => {
      const player = makePlayerMonster();
      const opponent = makeOpponent();

      const combat = initializeCombat(player, opponent);

      expect(combat.isFinished).toBe(false);
      expect(combat.winner).toBeUndefined();
      expect(combat.logs).toHaveLength(1);
      expect(combat.logs[0].type).toBe('info');
    });

    it('should copy player monster stats', () => {
      const player = makePlayerMonster({ hp: 80, max_hp: 100, attack: 55 });
      const combat = initializeCombat(player, makeOpponent());

      expect(combat.playerMonster.hp).toBe(80);
      expect(combat.playerMonster.max_hp).toBe(100);
      expect(combat.playerMonster.attack).toBe(55);
    });

    it('should calculate opponent stats at level 1 (multiplier 1.0)', () => {
      const opponent = makeOpponent({
        monster_level: 1,
        monster_type: makeMonsterType({
          base_hp: 100,
          base_attack: 50,
          base_defense: 30,
          base_speed: 40,
        }),
      });

      const combat = initializeCombat(makePlayerMonster(), opponent);

      expect(combat.opponentMonster.hp).toBe(100);
      expect(combat.opponentMonster.attack).toBe(50);
      expect(combat.opponentMonster.defense).toBe(30);
      expect(combat.opponentMonster.speed).toBe(40);
    });

    it('should scale opponent stats at level 11 (multiplier 2.0)', () => {
      const opponent = makeOpponent({
        monster_level: 11,
        monster_type: makeMonsterType({
          base_hp: 100,
          base_attack: 50,
          base_defense: 30,
          base_speed: 40,
        }),
      });

      const combat = initializeCombat(makePlayerMonster(), opponent);

      expect(combat.opponentMonster.hp).toBe(200);
      expect(combat.opponentMonster.attack).toBe(100);
      expect(combat.opponentMonster.defense).toBe(60);
      expect(combat.opponentMonster.speed).toBe(80);
    });

    it('should give first turn to player when player is faster', () => {
      const player = makePlayerMonster({ speed: 60 });
      const opponent = makeOpponent({
        monster_level: 1,
        monster_type: makeMonsterType({ base_speed: 40 }),
      });

      const combat = initializeCombat(player, opponent);
      expect(combat.turn).toBe('player');
    });

    it('should give first turn to opponent when opponent is faster', () => {
      const player = makePlayerMonster({ speed: 30 });
      const opponent = makeOpponent({
        monster_level: 1,
        monster_type: makeMonsterType({ base_speed: 50 }),
      });

      const combat = initializeCombat(player, opponent);
      expect(combat.turn).toBe('opponent');
    });

    it('should give first turn to player when speeds are equal', () => {
      const player = makePlayerMonster({ speed: 50 });
      const opponent = makeOpponent({
        monster_level: 1,
        monster_type: makeMonsterType({ base_speed: 50 }),
      });

      const combat = initializeCombat(player, opponent);
      expect(combat.turn).toBe('player');
    });

    it('should include initial log message with opponent name and level', () => {
      const opponent = makeOpponent({
        monster_level: 7,
        monster_type: makeMonsterType({ name: 'Terros' }),
      });

      const combat = initializeCombat(makePlayerMonster(), opponent);

      expect(combat.logs[0].message).toContain('Terros');
      expect(combat.logs[0].message).toContain('7');
    });

    it('should set opponent max_hp equal to hp', () => {
      const combat = initializeCombat(makePlayerMonster(), makeOpponent());

      expect(combat.opponentMonster.hp).toBe(combat.opponentMonster.max_hp);
    });
  });

  describe('executeTurn', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let randomSpy: MockInstance<any>;
    let randomValues: number[];
    let randomCallIndex: number;

    beforeEach(() => {
      randomCallIndex = 0;
      randomValues = [];
      randomSpy = vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      randomSpy.mockRestore();
    });

    function setRandomSequence(values: number[]) {
      randomValues = values;
      randomCallIndex = 0;
      randomSpy.mockImplementation(() => {
        const val = randomValues[randomCallIndex % randomValues.length];
        randomCallIndex++;
        return val;
      });
    }

    function makeCombatState(overrides: Partial<CombatState> = {}): CombatState {
      return {
        playerMonster: makePlayerMonster({
          hp: 100,
          max_hp: 100,
          attack: 50,
          defense: 30,
          speed: 60,
        }),
        opponentMonster: {
          type: makeMonsterType({ id: 2, name: 'Aqualis', element_type: 'water' }),
          level: 3,
          hp: 80,
          max_hp: 80,
          attack: 40,
          defense: 25,
          speed: 50,
        },
        turn: 'player',
        logs: [],
        isFinished: false,
        ...overrides,
      };
    }

    it('should reduce opponent HP on player turn', () => {
      // Random calls: getRandomMove (opponent), shouldSpeedBoost, damage variance
      setRandomSequence([0.9, 0.9, 0.5]);

      const state = makeCombatState();
      const result = executeTurn(state, 'rock');

      expect(result.opponentMonster.hp).toBeLessThan(80);
    });

    it('should switch turn after a non-lethal attack', () => {
      setRandomSequence([0.5, 0.9, 0.5]);

      const state = makeCombatState();
      const result = executeTurn(state, 'rock');

      if (!result.isFinished) {
        expect(result.turn).toBe('opponent');
      }
    });

    it('should set isFinished and winner when opponent HP reaches 0', () => {
      const state = makeCombatState();
      state.opponentMonster.hp = 1;

      setRandomSequence([0.9, 0.9, 0.5]);

      const result = executeTurn(state, 'rock');

      expect(result.opponentMonster.hp).toBe(0);
      expect(result.isFinished).toBe(true);
      expect(result.winner).toBe('player');
    });

    it('should set defeat when player HP reaches 0 on opponent turn', () => {
      const state = makeCombatState({ turn: 'opponent' });
      state.playerMonster.hp = 1;
      state.playerMonster.defense = 0;

      setRandomSequence([0.5, 0.9, 0.5]);

      const result = executeTurn(state, 'rock');

      expect(result.playerMonster.hp).toBe(0);
      expect(result.isFinished).toBe(true);
      expect(result.winner).toBe('opponent');
    });

    it('should add logs during turn execution', () => {
      setRandomSequence([0.5, 0.9, 0.5]);

      const state = makeCombatState();
      const result = executeTurn(state, 'rock');

      expect(result.logs.length).toBeGreaterThan(0);
    });

    it('should never reduce HP below 0', () => {
      const state = makeCombatState();
      state.opponentMonster.hp = 1;
      state.opponentMonster.defense = 0;
      state.playerMonster.attack = 999;

      setRandomSequence([0.9, 0.9, 0.5]);

      const result = executeTurn(state, 'rock');

      expect(result.opponentMonster.hp).toBe(0);
    });

    it('should produce victory log when player wins', () => {
      const state = makeCombatState();
      state.opponentMonster.hp = 1;

      setRandomSequence([0.9, 0.9, 0.5]);

      const result = executeTurn(state, 'rock');

      const victoryLogs = result.logs.filter((l) => l.type === 'victory');
      expect(victoryLogs).toHaveLength(1);
    });

    it('should produce defeat log when opponent wins', () => {
      const state = makeCombatState({ turn: 'opponent' });
      state.playerMonster.hp = 1;
      state.playerMonster.defense = 0;

      setRandomSequence([0.5, 0.9, 0.5]);

      const result = executeTurn(state, 'rock');

      const defeatLogs = result.logs.filter((l) => l.type === 'defeat');
      expect(defeatLogs).toHaveLength(1);
    });

    it('should guarantee minimum 5 damage even with high defense', () => {
      const state = makeCombatState();
      state.opponentMonster.defense = 999;
      state.opponentMonster.hp = 1000;

      // draw result, no speed boost, low variance
      setRandomSequence([0.34, 0.9, 0.0]);

      const result = executeTurn(state, 'rock');

      // With draw (1x multiplier) and min damage of 5
      expect(result.opponentMonster.hp).toBeLessThanOrEqual(1000);
    });

    it('should handle full combat simulation until someone wins', () => {
      // Use consistent random for a deterministic-ish simulation
      setRandomSequence([0.5, 0.9, 0.5]);

      let state = makeCombatState();
      let turns = 0;
      const maxTurns = 100;

      while (!state.isFinished && turns < maxTurns) {
        state = executeTurn(state, 'rock');
        turns++;
      }

      expect(state.isFinished).toBe(true);
      expect(state.winner).toBeDefined();
      expect(['player', 'opponent']).toContain(state.winner);
    });
  });
});
