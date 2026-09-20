import { describe, expect, it } from 'vitest';
import { initialLocale, translate } from '../../src/i18n/locale';

describe('language preference', () => {
  it('honors saved preferences before browser language', () => {
    expect(initialLocale({ getItem: () => 'en' }, ['zh-CN'])).toBe('en');
    expect(initialLocale({ getItem: () => 'zh' }, ['en-US'])).toBe('zh');
  });
  it('handles unavailable storage and unsupported preferences', () => {
    expect(initialLocale({ getItem: () => { throw new Error('blocked'); } }, ['zh-TW'])).toBe('zh');
    expect(initialLocale({ getItem: () => 'fr' }, ['en-US'])).toBe('en');
    expect(initialLocale(null, [])).toBe('en');
  });
  it('preserves technical content and translates dynamic feedback', () => {
    expect(translate('Projects', 'zh')).toBe('项目');
    expect(translate('PaoPao1021/weblog', 'zh')).toBe('PaoPao1021/weblog');
    expect(translate('command not found: wat', 'zh')).toBe('未找到命令：wat');
    expect(translate("PaoPao1021's personal site", 'zh')).toBe('PaoPao1021 的个人站点');
  });
});
