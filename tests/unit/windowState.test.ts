import { describe, expect, it } from 'vitest';
import { clampPosition, desktopReducer, initialDesktop } from '../../src/app/windowState';

describe('desktopReducer', () => {
  it('reopens an existing window, restores it, and moves it to the front', () => {
    let state = desktopReducer(initialDesktop, { type: 'open', app: 'projects', item: 'first' });
    state = desktopReducer(state, { type: 'open', app: 'about' });
    state = desktopReducer(state, { type: 'minimize', app: 'projects' });
    state = desktopReducer(state, { type: 'open', app: 'projects', item: 'second' });

    expect(state.active).toBe('projects');
    expect(state.windows.map((window) => window.app)).toEqual(['about', 'projects']);
    expect(state.windows.at(-1)).toMatchObject({ minimized: false, item: 'second' });
  });

  it('focuses the next visible window when closing or minimizing the active one', () => {
    let state = desktopReducer(initialDesktop, { type: 'open', app: 'projects' });
    state = desktopReducer(state, { type: 'open', app: 'notes' });
    state = desktopReducer(state, { type: 'minimize', app: 'notes' });
    expect(state.active).toBe('projects');
    state = desktopReducer(state, { type: 'close', app: 'projects' });
    expect(state).toEqual({ active: null, windows: [{ app: 'notes', minimized: true, expanded: false, position: { x: 20, y: -6 }, item: undefined }] });
  });

  it('minimizes every window on home while preserving window state', () => {
    let state = desktopReducer(initialDesktop, { type: 'open', app: 'projects' });
    state = desktopReducer(state, { type: 'open', app: 'terminal' });
    expect(desktopReducer(state, { type: 'home' })).toMatchObject({ active: null, windows: [{ minimized: true }, { minimized: true }] });
  });
});

describe('clampPosition', () => {
  it('keeps positions within both viewport bounds, including oversized windows', () => {
    expect(clampPosition({ x: 999, y: -999 }, 760, 480, { width: 1000, height: 700 })).toEqual({ x: 108, y: -52 });
    expect(clampPosition({ x: -999, y: 999 }, 1400, 900, { width: 1000, height: 700 })).toEqual({ x: 12, y: 0 });
  });
});
