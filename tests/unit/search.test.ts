import { describe, expect, it } from 'vitest';
import { searchScore } from '../../src/utils/search';

describe('searchScore', () => {
  it('ranks exact, prefix, substring, and subsequence matches in that order', () => {
    expect(searchScore('Terminal', 'terminal')).toBe(100);
    expect(searchScore('Terminal', 'ter')).toBe(80);
    expect(searchScore('My terminal', 'terminal')).toBe(60);
    expect(searchScore('Tactical Error Network', 'ten')).toBe(20);
  });

  it('is case-insensitive, trims the query, and excludes non-matches', () => {
    expect(searchScore('Project Atlas', '  ATLAS ')).toBe(60);
    expect(searchScore('Project Atlas', 'xyz')).toBe(0);
    expect(searchScore('Anything', '   ')).toBe(1);
  });
});
