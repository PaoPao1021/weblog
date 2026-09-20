import repositories from '../../data/github-repositories.json';
import { translate } from '../../i18n/locale';
import { useLocale } from '../../i18n/context';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpRight, Command, CornerDownLeft, Search } from 'lucide-react';
import { apps } from '../../app/appRegistry';
import { appIds } from '../../app/route';
import { siteConfig, type ThemeMode } from '../../config/site';
import type { Navigate } from '../../app/types';
import { projects } from '../../data/projects';
import { notes } from '../../data/notes';
import { assetUrl } from '../../utils/assets';
import { searchScore } from '../../utils/search';

interface Props { navigate: Navigate; setTheme: (theme: ThemeMode) => void; onClose: () => void; returnFocus: HTMLElement | null }
export default function CommandPalette({ navigate, setTheme, onClose, returnFocus }: Props) {
  const { t } = useLocale();
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState(''); const [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null); const panel = useRef<HTMLDivElement>(null);
  const restoreTrigger = useRef(true);
  const commands = useMemo(() => [
    ...appIds.map(id => ({ id, label: apps[id].title, detail: apps[id].subtitle, category: 'Application', action: () => navigate(id) })),
    ...repositories.map(repo => ({ id: `repo-${repo.name}`, label: repo.name, detail: repo.description ?? 'GitHub repositories', category: 'Repository', action: () => { window.open(repo.url, '_blank', 'noopener,noreferrer'); } })),
    ...projects.map(project => ({ id: `project-${project.id}`, label: project.title, detail: project.description, category: 'Project', action: () => navigate('projects', project.id) })),
    ...notes.map(note => ({ id: `note-${note.id}`, label: note.title, detail: note.tags.join(' '), category: 'Note', action: () => navigate('notes', note.id) })),
    ...(['light', 'dark', 'system'] as const).map(theme => ({ id: `theme-${theme}`, label: `${theme[0].toUpperCase()}${theme.slice(1)} theme`, detail: 'Change appearance', category: 'Preference', action: () => setTheme(theme) })),
    ...([{ label: 'GitHub', url: siteConfig.github }, { label: 'Email', url: siteConfig.email ? `mailto:${siteConfig.email}` : null }, { label: 'Resume', url: siteConfig.resume ? assetUrl(siteConfig.resume) : null }]).filter(link => link.url).map(link => ({ id: link.label, label: link.label, detail: 'Open external link', category: 'Link', action: () => { window.open(link.url!, '_blank', 'noopener,noreferrer'); } })),
  ], [navigate, setTheme]);
  const results = commands.map(command => ({ ...command, score: searchScore(`${command.label} ${command.detail} ${translate(command.label, 'zh')} ${translate(command.detail, 'zh')}`, query) })).filter(command => command.score > 0).sort((a, b) => b.score - a.score).slice(0, 12);
  useEffect(() => {
    input.current?.focus();
    return () => {
      requestAnimationFrame(() => {
        const target = restoreTrigger.current ? returnFocus : document.querySelector<HTMLElement>('.glass-window.is-active');
        if (target?.isConnected && !target.closest('[inert]')) target.focus({ preventScroll: true });
      });
    };
  }, [returnFocus]);
  useEffect(() => { document.getElementById(`command-${results[selected]?.id}`)?.scrollIntoView({ block: 'nearest' }); }, [selected, results]);
  function run(index: number) {
    const result = results[index];
    if (result) {
      restoreTrigger.current = !['Application', 'Project', 'Note'].includes(result.category);
      onClose(); result.action();
    }
  }
  return <motion.div className="command-overlay" initial={reducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.18 }} onPointerDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.div className="command-panel glass-panel" ref={panel} role="dialog" aria-modal="true" aria-label={t("Command palette")} initial={{ y: -12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} onKeyDown={event => {
      if (event.nativeEvent.isComposing) return;
      if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
      if (event.key === 'ArrowDown') { event.preventDefault(); setSelected(i => results.length ? (i + 1) % results.length : 0); }
      if (event.key === 'ArrowUp') { event.preventDefault(); setSelected(i => results.length ? (i - 1 + results.length) % results.length : 0); }
      if (event.key === 'Enter' && event.target === input.current) { event.preventDefault(); run(selected); }
      if (event.key === 'Tab') {
        const close = panel.current?.querySelector<HTMLButtonElement>('button');
        if ((event.shiftKey && event.target === input.current) || (!event.shiftKey && event.target === close)) {
          event.preventDefault();
          if (event.shiftKey) close?.focus(); else input.current?.focus();
        }
      }
    }}>
      <div className="command-input"><Search size={21} /><input ref={input} placeholder={t("Where would you like to go?")} aria-label={t("Search applications, projects, notes and themes")} role="combobox" aria-expanded="true" aria-controls="command-results" aria-autocomplete="list" aria-activedescendant={results[selected] ? `command-${results[selected].id}` : undefined} value={query} onChange={event => { setQuery(event.target.value); setSelected(0); }} /><button onClick={onClose} aria-label={t("Close command palette")}><kbd>esc</kbd></button></div>
      <p className="command-section-label">{t(query ? 'SEARCH RESULTS' : 'JUMP TO')}</p>
      <ul id="command-results" role="listbox" className="command-results">{results.map((result, index) => <li key={result.id} id={`command-${result.id}`} role="option" aria-selected={index === selected} className={index === selected ? 'selected' : ''} onPointerMove={() => setSelected(index)} onClick={() => run(index)}><span className="command-result-icon"><Command size={16} /></span><span><strong>{t(result.label)}</strong><small>{t(result.category)}</small></span><ArrowUpRight size={15} /></li>)}</ul>
      {!results.length && <p className="command-empty">{t("Nothing here yet. Try “projects”, “notes”, or “theme”.")}</p>}
      <footer className="command-footer"><span><ArrowUp size={12} /><ArrowDown size={12} /> {t("to navigate")}</span><span><CornerDownLeft size={13} /> {t("to open")}</span><span>{t("Find your way around.")}</span></footer>
    </motion.div>
  </motion.div>;
}
