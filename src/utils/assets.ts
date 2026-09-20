export function assetUrl(path: string): string {
  if (/^(https?:|mailto:|data:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
