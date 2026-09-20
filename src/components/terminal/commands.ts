import { siteConfig } from '../../config/site';
import type { ThemeMode } from '../../config/site';
import { projects } from '../../data/projects';

export type TerminalAction = 'clear' | 'theme-light' | 'theme-dark' | 'theme-system';

export interface CommandResult {
  lines?: string[];
  link?: { href: string; label: string };
  action?: TerminalAction;
}

const helpLines = [
  'Available commands:',
  '  help              show this list',
  '  whoami            a little introduction',
  '  ls                list this directory',
  '  ls projects       list projects',
  '  cat about.txt     read about me',
  '  cat README.md     read this site’s README',
  '  github            open the source profile',
  '  theme [mode]      light, dark, or system',
  '  date              show the current date',
  '  contact           find a way to get in touch',
  '  clear             clear the screen',
  '  sudo hire-me      make an excellent decision',
];

/** Parses the simulated terminal's small, deliberately non-shell command set. */
export function parseCommand(input: string, theme?: ThemeMode): CommandResult {
  const command = input.trim().replace(/\s+/g, ' ').toLowerCase();

  if (!command) return {};
  if (command === 'help') return { lines: helpLines };
  if (command === 'whoami') return { lines: [`${siteConfig.name} — ${siteConfig.description}`] };
  if (command === 'ls') return { lines: ['about.txt  README.md  projects/'] };
  if (command === 'ls projects') return { lines: projects.map((project) => `${project.title} [${project.status}]`) };
  if (command === 'cat about.txt') return { lines: [siteConfig.about.whoIAm] };
  if (command === 'cat readme.md') {
    return { lines: [`${siteConfig.name}'s personal site`, 'Built with care. Type help to explore.'] };
  }
  if (command === 'github') {
    if (siteConfig.github) return { lines: ['GitHub:'], link: { href: siteConfig.github, label: siteConfig.github } };
    return { lines: ['GitHub has not been configured yet.'] };
  }
  if (command === 'clear') return { action: 'clear' };
  if (command === 'theme') {
    const currentTheme = theme ?? 'system';
    return { lines: [`Current theme: ${currentTheme}. Try: theme light, theme dark, or theme system.`] };
  }
  if (command === 'theme light') return { lines: ['Theme set to light.'], action: 'theme-light' };
  if (command === 'theme dark') return { lines: ['Theme set to dark.'], action: 'theme-dark' };
  if (command === 'theme system') return { lines: ['Theme set to system.'], action: 'theme-system' };
  if (command === 'date') return { lines: [new Date().toString()] };
  if (command === 'contact') {
    if (siteConfig.email) return { lines: [`Email: ${siteConfig.email}`] };
    return { lines: ['Contact details have not been configured yet.'] };
  }
  if (command === 'sudo hire-me') {
    const contact = siteConfig.email
      ? `Contact: ${siteConfig.email}`
      : 'Contact details have not been configured yet.';
    return { lines: ['Permission granted.', 'Opening contact...', contact] };
  }

  return { lines: [`command not found: ${input.trim()}`, 'Type help for available commands.'] };
}
