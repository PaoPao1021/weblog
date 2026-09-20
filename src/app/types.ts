export type AppId = 'projects' | 'notes' | 'about' | 'terminal' | 'system';
export interface AppRoute { app: AppId | null; item?: string }
export type Navigate = (app: AppId | null, item?: string) => void;
export interface ContentProps { item?: string; navigate: Navigate }
