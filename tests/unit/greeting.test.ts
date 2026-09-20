import { describe, expect, it } from 'vitest';
import { greeting } from '../../src/utils/greeting';

describe('greeting', () => {
  it('changes at the morning and afternoon boundaries', () => {
    expect(greeting(4)).toBe('Good evening.');
    expect(greeting(5)).toBe('Good morning.');
    expect(greeting(11)).toBe('Good morning.');
    expect(greeting(12)).toBe('Good afternoon.');
  });

  it('returns evening from 18 through the overnight hours', () => {
    expect(greeting(17)).toBe('Good afternoon.');
    expect(greeting(18)).toBe('Good evening.');
    expect(greeting(0)).toBe('Good evening.');
  });
});
