import {
  formatDate,
  formatDateWithDay,
  getDaysUntil,
  isPastEvent,
} from '../formatDate';

describe('formatDate utilities', () => {
  describe('formatDate', () => {
    it('formats ISO date to readable format', () => {
      const result = formatDate('2025-12-15');
      expect(result).toContain('Dec');
      expect(result).toContain('15');
      expect(result).toContain('2025');
    });

    it('returns empty string for null input', () => {
      expect(formatDate(null)).toBe('');
    });

    it('returns empty string for undefined input', () => {
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('formatDateWithDay', () => {
    it('includes day of week', () => {
      const result = formatDateWithDay('2025-12-15');
      expect(result).toContain('Monday');
    });

    it('returns empty string for null input', () => {
      expect(formatDateWithDay(null)).toBe('');
    });
  });

  describe('getDaysUntil', () => {
    it('returns 0 for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(getDaysUntil(today)).toBe(0);
    });

    it('returns positive number for future date', () => {
      const future = new Date();
      future.setDate(future.getDate() + 7);
      const futureStr = future.toISOString().split('T')[0];
      expect(getDaysUntil(futureStr)).toBe(7);
    });

    it('returns null for past date', () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);
      const pastStr = past.toISOString().split('T')[0];
      expect(getDaysUntil(pastStr)).toBeNull();
    });

    it('returns null for invalid input', () => {
      expect(getDaysUntil(null)).toBeNull();
    });
  });

  describe('isPastEvent', () => {
    it('returns true for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      expect(isPastEvent(yesterdayStr)).toBe(true);
    });

    it('returns false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      expect(isPastEvent(tomorrowStr)).toBe(false);
    });

    it('returns false for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(isPastEvent(today)).toBe(false);
    });

    it('returns false for null input', () => {
      expect(isPastEvent(null)).toBe(false);
    });
  });
});