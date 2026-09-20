import { FolderOpen, Sprout, UserRound, SquareTerminal, Activity } from 'lucide-react';
import type { AppId } from './types';
export const apps = {
  projects: { title: 'Projects', subtitle: 'Selected work', icon: FolderOpen, shortcut: '01' },
  notes: { title: 'Notes', subtitle: 'A digital garden', icon: Sprout, shortcut: '02' },
  about: { title: 'About', subtitle: 'The person behind the pixels', icon: UserRound, shortcut: '03' },
  terminal: { title: 'Terminal', subtitle: 'A different way to explore', icon: SquareTerminal, shortcut: '04' },
  system: { title: 'System', subtitle: 'All the little details', icon: Activity, shortcut: '05' },
} satisfies Record<AppId, { title: string; subtitle: string; icon: typeof FolderOpen; shortcut: string }>;
