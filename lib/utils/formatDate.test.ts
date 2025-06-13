import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('should format the date correctly', () => {
    expect(formatDate('2023-01-01')).toBe('Jan 1 2023');
  });
});
