import type { Dictionary } from '@/lib/i18n';

export function SearchDialog({ c, onClose }: { c: Dictionary; onClose: () => void }) {
  return <div className="search-overlay" role="presentation" onMouseDown={onClose}><section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title" onMouseDown={(event) => event.stopPropagation()}><div className="search-input-wrap"><span aria-hidden="true">⌕</span><label className="sr-only" htmlFor="site-search" id="search-title">{c.searchAria}</label><input id="site-search" autoFocus placeholder={c.searchPlaceholder} /><button type="button" onClick={onClose}>ESC</button></div><div className="search-suggestions"><span>{c.suggested}</span>{c.suggestions.map((item) => <button type="button" key={item}>{item}</button>)}</div><p>{c.searchHint}</p></section></div>;
}
