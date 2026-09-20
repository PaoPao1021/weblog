import { describe, expect, it } from 'vitest';
import { parseCommand } from '../../src/components/terminal/commands';

describe('parseCommand', () => {
  it('normalizes whitespace and exposes the command help', () => {
    expect(parseCommand('  LS   projects  ').lines).toContain('Project One [in-progress]');
    expect(parseCommand('help').lines?.[0]).toBe('Available commands:');
  });

  it('returns structured results without markup for links and actions', () => {
    expect(parseCommand('clear')).toEqual({ action: 'clear' });
    expect(parseCommand('theme dark').action).toBe('theme-dark');
    expect(parseCommand('theme', 'dark').lines?.[0]).toContain('dark');
    const github = parseCommand('github');
    expect(github.lines).toBeDefined();
    expect(github.link).toBeUndefined();
  });

  it('returns the simulated hiring response and unknown command guidance', () => {
    expect(parseCommand('sudo hire-me').lines?.slice(0, 2)).toEqual(['Permission granted.', 'Opening contact...']);
    expect(parseCommand('wat').lines).toEqual(['command not found: wat', 'Type help for available commands.']);
  });
});
