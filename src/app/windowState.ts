import type { AppId } from './types';

export interface Position { x: number; y: number }
export interface WindowState { app: AppId; item?: string; minimized: boolean; expanded: boolean; position: Position }
export interface DesktopState { windows: WindowState[]; active: AppId | null }
export const initialDesktop: DesktopState = { windows: [], active: null };
export type DesktopAction =
  | { type: 'open'; app: AppId; item?: string }
  | { type: 'focus' | 'close' | 'minimize' | 'expand'; app: AppId }
  | { type: 'move'; app: AppId; position: Position }
  | { type: 'home' };
export const windowSizes: Record<AppId, { width: number; height: number }> = {
  projects: { width: 960, height: 680 }, notes: { width: 900, height: 680 },
  about: { width: 760, height: 620 }, terminal: { width: 760, height: 480 },
  system: { width: 390, height: 470 },
};
export function clampPosition(position: Position, width: number, height: number, viewport: { width: number; height: number }): Position {
  return {
    x: Math.min(Math.max(position.x, -(viewport.width - width) / 2 + 12), Math.max(12, (viewport.width - width) / 2 - 12)),
    y: Math.min(Math.max(position.y, -(viewport.height - height) / 2 + 58), Math.max(0, (viewport.height - height) / 2 - 104)),
  };
}
export function desktopReducer(state: DesktopState, action: DesktopAction): DesktopState {
  if (action.type === 'home') return { active: null, windows: state.windows.map(w => ({ ...w, minimized: true })) };
  const existing = state.windows.find(w => w.app === action.app);
  if (action.type === 'open') {
    const next: WindowState = existing
      ? { ...existing, minimized: false, item: action.item }
      : { app: action.app, item: action.item, minimized: false, expanded: false, position: { x: state.windows.length % 3 * 20, y: state.windows.length % 3 * 14 - 20 } };
    return { active: action.app, windows: [...state.windows.filter(w => w.app !== action.app), next] };
  }
  if (!existing) return state;
  if (action.type === 'focus') return { active: action.app, windows: [...state.windows.filter(w => w.app !== action.app), { ...existing, minimized: false }] };
  const windows = state.windows.flatMap(w => {
    if (w.app !== action.app) return [w];
    if (action.type === 'close') return [];
    if (action.type === 'minimize') return [{ ...w, minimized: true }];
    if (action.type === 'expand') return [{ ...w, expanded: !w.expanded }];
    if (action.type === 'move') return [{ ...w, position: action.position }];
    return [w];
  });
  const active = (action.type === 'close' || action.type === 'minimize') && state.active === action.app
    ? [...windows].reverse().find(w => !w.minimized)?.app ?? null : state.active;
  return { windows, active };
}
