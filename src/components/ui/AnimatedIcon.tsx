import { Code2, FileText, FolderOpen, Github, House, Mail, Search, Sprout, SquareTerminal, UserRound } from 'lucide-react';

const icons = { home: House, projects: FolderOpen, notes: Sprout, about: UserRound, terminal: SquareTerminal, code: Code2, document: FileText, github: Github, mail: Mail, search: Search };
export type AnimatedIconName = keyof typeof icons;

/** Lucide geometry stays recognizable; CSS moves only small, meaningful parts. */
export function AnimatedIcon({ name, size = 20, strokeWidth = 1.7 }: { name: AnimatedIconName; size?: number; strokeWidth?: number }) {
  const Icon = icons[name];
  return <span className="animated-icon" data-icon={name} aria-hidden="true"><Icon size={size} strokeWidth={strokeWidth} /></span>;
}
