import type { AppId, AppRoute } from './types';

export const appIds: AppId[] = ['projects', 'notes', 'about', 'terminal', 'system'];
export function parseRoute(hash: string): AppRoute {
  try {
    const [app, item] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    if (!appIds.includes(app as AppId)) return { app: null };
    return { app: app as AppId, ...(item ? { item } : {}) };
  } catch { return { app: null }; }
}
export function routeHash(route: AppRoute): string {
  return route.app ? `#/${route.app}${route.item ? `/${encodeURIComponent(route.item)}` : ''}` : '#/';
}
