import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  TRAINING_OPTIONS,
  TRAINING_DURATION_PER_POINT,
  calculateTrainingDuration,
  formatTrainingDuration,
  getRemainingTrainingTime,
  formatRemainingTime,
} from './training.client';

describe('Training System', () => {
  describe('TRAINING_OPTIONS', () => {
    it('should have 4 training options', () => {
      expect(TRAINING_OPTIONS).toHaveLength(4);
    });

    it('should include hp, attack, defense, speed', () => {
      const names = TRAINING_OPTIONS.map((o) => o.name);
      expect(names).toContain('hp');
      expect(names).toContain('attack');
      expect(names).toContain('defense');
      expect(names).toContain('speed');
    });

    it('should have positive costs and improvements', () => {
      for (const option of TRAINING_OPTIONS) {
        expect(option.cost).toBeGreaterThan(0);
        expect(option.improvement).toBeGreaterThan(0);
      }
    });

    it('should have labels for each option', () => {
      for (const option of TRAINING_OPTIONS) {
        expect(option.label).toBeTruthy();
      }
    });
  });

  describe('calculateTrainingDuration', () => {
    it('should return duration in milliseconds', () => {
      const result = calculateTrainingDuration(1);
      expect(result).toBe(TRAINING_DURATION_PER_POINT * 60 * 1000);
    });

    it('should scale linearly with improvement', () => {
      const duration5 = calculateTrainingDuration(5);
      const duration10 = calculateTrainingDuration(10);
      expect(duration10).toBe(duration5 * 2);
    });

    it('should return 0 for 0 improvement', () => {
      expect(calculateTrainingDuration(0)).toBe(0);
    });

    it('should match expected values for training options', () => {
      // HP: improvement = 10 -> 10 minutes -> 600000 ms
      const hpOption = TRAINING_OPTIONS.find((o) => o.name === 'hp')!;
      expect(calculateTrainingDuration(hpOption.improvement)).toBe(
        hpOption.improvement * TRAINING_DURATION_PER_POINT * 60 * 1000
      );
    });
  });

  describe('formatTrainingDuration', () => {
    it('should format minutes for small improvements', () => {
      expect(formatTrainingDuration(5)).toBe('5 min');
    });

    it('should format minutes for improvements under 60', () => {
      expect(formatTrainingDuration(30)).toBe('30 min');
    });

    it('should format hours for exactly 60 minutes', () => {
      expect(formatTrainingDuration(60)).toBe('1h');
    });

    it('should format hours and minutes for mixed values', () => {
      expect(formatTrainingDuration(90)).toBe('1h30');
    });

    it('should format multiple hours', () => {
      expect(formatTrainingDuration(120)).toBe('2h');
    });

    it('should handle training option improvements', () => {
      // HP: 10 improvement * 1 min = 10 min
      expect(formatTrainingDuration(10)).toBe('10 min');
      // Speed: 3 improvement * 1 min = 3 min
      expect(formatTrainingDuration(3)).toBe('3 min');
    });
  });

  describe('getRemainingTrainingTime', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return 0 for null endTime', () => {
      expect(getRemainingTrainingTime(null)).toBe(0);
    });

    it('should return positive value for future end time', () => {
      const futureDate = new Date(Date.now() + 60000); // 1 minute from now
      const remaining = getRemainingTrainingTime(futureDate);
      expect(remaining).toBeGreaterThan(0);
      expect(remaining).toBeLessThanOrEqual(60000);
    });

    it('should return 0 for past end time', () => {
      const pastDate = new Date(Date.now() - 60000); // 1 minute ago
      expect(getRemainingTrainingTime(pastDate)).toBe(0);
    });

    it('should return 0 for current time', () => {
      const now = new Date();
      expect(getRemainingTrainingTime(now)).toBe(0);
    });
  });

  describe('formatRemainingTime', () => {
    it('should return "Termine" for 0 milliseconds', () => {
      expect(formatRemainingTime(0)).toBe('Terminé');
    });

    it('should return "Termine" for negative values', () => {
      expect(formatRemainingTime(-1000)).toBe('Terminé');
    });

    it('should format seconds only', () => {
      expect(formatRemainingTime(30000)).toBe('30s');
    });

    it('should format minutes and seconds', () => {
      expect(formatRemainingTime(90000)).toBe('1m 30s');
    });

    it('should format exact minutes', () => {
      expect(formatRemainingTime(120000)).toBe('2m 0s');
    });

    it('should format hours and minutes', () => {
      expect(formatRemainingTime(3660000)).toBe('1h 1m');
    });

    it('should format exact hours', () => {
      expect(formatRemainingTime(3600000)).toBe('1h 0m');
    });

    it('should format multiple hours', () => {
      expect(formatRemainingTime(7200000)).toBe('2h 0m');
    });

    it('should format 1 second', () => {
      expect(formatRemainingTime(1000)).toBe('1s');
    });

    it('should truncate sub-second values', () => {
      // 1500ms = 1.5 seconds, should show as 1s
      expect(formatRemainingTime(1500)).toBe('1s');
    });
  });
});
