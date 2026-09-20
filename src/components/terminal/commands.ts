import { siteConfig } from '../../config/site';
import type { ThemeMode } from '../../config/site';
import { projects } from '../../data/projects';

export type TerminalAction = 'clear' | 'theme-light' | 'theme-dark' | 'theme-system';

export interface CommandResult {
  lines?: string[];
  link?: { href: string; label: string };
  action?: TerminalAction;
}

const quotes = [
  '“Simplicity is prerequisite for reliability.” — Edsger W. Dijkstra',
  '“The best way to predict the future is to invent it.” — Alan Kay',
  '“Good design is as little design as possible.” — Dieter Rams',
  '“Make it work, make it right, make it fast.” — Kent Beck',
  '“Stay hungry, stay foolish.” — Steve Jobs',
  '“Programs must be written for people to read, and only incidentally for machines to execute.” — Harold Abelson',
  '“Talk is cheap. Show me the code.” — Linus Torvalds',
];

function getWeather(city?: string): string[] {
  const target = city ? city.toUpperCase() : 'CYBERSPACE';
  return [
    `  Weather Forecast for [${target}]:`,
    '  ┌──────────────┬───────────────────────────────┐',
    '  │    \\  /      │ Condition: Clear & Serene     │',
    '  │  _ /"".\\ _   │ Temperature: 22°C (71.6°F)    │',
    '  │    \\__/      │ Humidity: 45%  Wind: 3 km/h   │',
    '  │   /  \\       │ Air Index: Crystal Clear (AQI 12)│',
    '  └──────────────┴───────────────────────────────┘',
    '  A beautiful day to craft thoughtful software.',
  ];
}

function cowsay(text: string): string[] {
  const clean = text.trim() || 'Moo! Welcome to WeblogOS!';
  const len = Math.max(clean.length, 10);
  const border = '─'.repeat(len + 2);
  return [
    ` ┌${border}┐`,
    ` │ ${clean.padEnd(len, ' ')} │`,
    ` └${border}┘`,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ];
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
  '  neofetch          display system telemetry',
  '  weather [city]    display weather report',
  '  fortune / quote   words of wisdom',
  '  cowsay [message]  cow speaking ascii',
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
  if (command === 'neofetch' || command === 'fastfetch') {
    return {
      lines: [
        '  ╭────────────────────────────────────╮',
        `  │ OS:     WeblogOS (Liquid Glass)    │`,
        `  │ Host:   ${siteConfig.name}'s Weblog    │`,
        `  │ Kernel: React 19.0 + Vite 6        │`,
        `  │ Shell:  weblog-sh 1.0              │`,
        `  │ Theme:  ${theme ?? 'system'}                     │`,
        `  │ Engine: Tailwind v4 + Motion       │`,
        '  ╰────────────────────────────────────╯',
      ],
    };
  }
  if (command === 'weather' || command.startsWith('weather ')) {
    const city = command.startsWith('weather ') ? input.trim().slice(8).trim() : undefined;
    return { lines: getWeather(city) };
  }
  if (command === 'quote' || command === 'fortune') {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    return { lines: [quote] };
  }
  if (command === 'cowsay' || command.startsWith('cowsay ')) {
    const msg = command.startsWith('cowsay ') ? input.trim().slice(7).trim() : 'Moo! Welcome to WeblogOS!';
    return { lines: cowsay(msg) };
  }
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
