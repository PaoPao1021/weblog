import { describe, expect, it } from 'vitest';
import { parseRoute, routeHash } from '../../src/app/route';

describe('routing helpers', () => {
  it('round-trips an app route and safely encodes an item name', () => {
    const route = { app: 'projects' as const, item: 'design notes/α' };
    expect(routeHash(route)).toBe('#/projects/design%20notes%2F%CE%B1');
    expect(parseRoute(routeHash(route))).toEqual(route);
  });

  it('supports app-only and home routes', () => {
    expect(parseRoute('#/terminal')).toEqual({ app: 'terminal' });
    expect(routeHash({ app: null })).toBe('#/');
  });

  it('rejects unknown apps and malformed percent encodings', () => {
    expect(parseRoute('#/unknown')).toEqual({ app: null });
    expect(parseRoute('#/projects/%E0%A4%A')).toEqual({ app: null });
  });
});
