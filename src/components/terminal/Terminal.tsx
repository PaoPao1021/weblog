import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { siteConfig } from '../../config/site';
import type { ThemeMode } from '../../config/site';
import { CommandResult, parseCommand } from './commands';
import '../../styles/terminal.css';

interface OutputEntry {
  id: number;
  command: string;
  result: CommandResult;
}

interface TerminalProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const MAX_HISTORY = 40;
const MAX_OUTPUT = 80;

export default function Terminal({ theme, setTheme }: TerminalProps) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const [output, setOutput] = useState<OutputEntry[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldFollowRef = useRef(true);
  const idRef = useRef(0);

  useEffect(() => {
    if (shouldFollowRef.current) outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [output]);

  function execute(command: string) {
    const trimmed = command.trim();
    if (!trimmed) return;
    shouldFollowRef.current = true;
    const result = parseCommand(trimmed, theme);
    setHistory((previous) => [...previous, trimmed].slice(-MAX_HISTORY));
    setHistoryIndex(null);
    setDraft('');
    setValue('');

    if (result.action === 'clear') {
      setOutput([]);
    } else {
      idRef.current += 1;
      setOutput((previous) => [...previous, { id: idRef.current, command: trimmed, result }].slice(-MAX_OUTPUT));
      if (result.action === 'theme-light') setTheme('light');
      if (result.action === 'theme-dark') setTheme('dark');
      if (result.action === 'theme-system') setTheme('system');
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    execute(value);
  }

  const availableCommands = [
    'help', 'whoami', 'ls', 'ls projects', 'cat about.txt', 'cat README.md',
    'github', 'theme', 'theme light', 'theme dark', 'theme system',
    'date', 'contact', 'clear', 'sudo hire-me',
  ];

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;
    if (event.key === 'Tab') {
      event.preventDefault();
      const current = value.trimStart().toLowerCase();
      if (!current) return;
      const match = availableCommands.find((c) => c.startsWith(current));
      if (match) setValue(match);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!history.length) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      if (historyIndex === null) setDraft(value);
      setHistoryIndex(next);
      setValue(history[next]);
    }
    if (event.key === 'ArrowDown' && historyIndex !== null) {
      event.preventDefault();
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setValue(draft);
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
    }
  }

  return (
    <section className="terminal-shell" aria-label="Interactive portfolio terminal">
      <div className="terminal-body" ref={outputRef} onClick={(event) => {
        if (event.target === event.currentTarget) inputRef.current?.focus();
      }} onScroll={(event) => {
        const element = event.currentTarget;
        shouldFollowRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 24;
      }}>
        <div className="terminal-welcome">
          <span className="terminal-logo">▣</span>
          <div><strong>{siteConfig.name}</strong><span>personal terminal · theme: {theme}</span></div>
        </div>
        <p className="terminal-hint">Type <kbd>help</kbd> to see what’s available. Press <kbd>Tab</kbd> to autocomplete.</p>
        {output.map((entry) => <div className="terminal-entry" key={entry.id}>
          <div className="terminal-command"><span>visitor@portfolio <b>~</b> %</span>{entry.command}</div>
          {entry.result.lines?.map((line, index) => <p key={index}>{line}</p>)}
          {entry.result.link && <a href={entry.result.link.href} target="_blank" rel="noreferrer noopener">{entry.result.link.label}</a>}
        </div>)}
        <form className="terminal-form" onSubmit={submit}>
          <label htmlFor="terminal-command" className="terminal-prompt">visitor@portfolio <b>~</b> %</label>
          <input id="terminal-command" ref={inputRef} value={value} onChange={(event) => { setValue(event.target.value); setHistoryIndex(null); }} onKeyDown={handleKeyDown} autoComplete="off" autoCapitalize="none" spellCheck={false} aria-label="Terminal command" />
        </form>
      </div>
    </section>
  );
}
