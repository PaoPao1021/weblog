import zh from './zh.json';
export type Locale = 'en' | 'zh';
const dictionary: Record<string, string> = zh;
export function initialLocale(storage: Pick<Storage, 'getItem'> | null, languages: readonly string[]): Locale {
  try { const saved = storage?.getItem('personal-os-language'); if (saved === 'zh' || saved === 'en') return saved; } catch { /* Browser language remains available. */ }
  return languages[0]?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}
export function translate(text: string, locale: Locale): string {
  if (locale === 'en') return text;
  if (text.startsWith('command not found: ')) return `未找到命令：${text.slice(19)}`;
  const theme = text.match(/^Current theme: (light|dark|system)\. Try: theme light, theme dark, or theme system\.$/);
  if (theme) return `当前主题：${dictionary[theme[1]]}。试试 theme light、theme dark 或 theme system。`;
  if (text.endsWith("'s personal site")) return `${text.slice(0, -16)} 的个人站点`;
  if (text.includes(' — ')) {
    const [name, description] = text.split(' — ');
    if (dictionary[description]) return `${name} — ${dictionary[description]}`;
  }
  return dictionary[text.trim()] ?? text;
}
