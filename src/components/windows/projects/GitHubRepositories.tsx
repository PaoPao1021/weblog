import { ArrowUpRight, GitFork, Github } from 'lucide-react';
import repositories from '../../../data/github-repositories.json';
import { siteConfig } from '../../../config/site';
import { useLocale } from '../../../i18n/context';

const englishDescriptions: Record<string, string> = {
  'expense-tracker': 'A glass-inspired expense tracker built with React, Vite and Tailwind. Installable as a PWA.',
  'Love-Space-Standalone-App': 'An app for two fixed users, built with Flutter, Spring Boot and MySQL. Supports Android and an iPhone home-screen PWA.',
  LearnTrack: 'A local-first study-time journal with focus timers, analytics, a heatmap calendar, learning paths, offline use and private sync.',
};

export default function GitHubRepositories() {
  const { locale, t } = useLocale();
  return <section className="repository-section" aria-labelledby="repositories-title">
    <header className="content-intro">
      <h1 id="repositories-title">{t('Open source, in progress.')}</h1>
      <p>{t('Public repositories from PaoPao1021. Explore the source, follow along, or start a conversation on GitHub.')}</p>
      <a className="repository-profile content-back" href={siteConfig.github!} target="_blank" rel="noopener noreferrer"><Github size={17} aria-hidden="true" />{t('GitHub profile')}<ArrowUpRight size={15} aria-hidden="true" /></a>
    </header>
    <div className="repository-list">
      {repositories.map(repo => <a className="repository-row" href={repo.url} key={repo.name} target="_blank" rel="noopener noreferrer">
        <span className="repository-icon">{repo.fork ? <GitFork size={20} aria-hidden="true" /> : <Github size={20} aria-hidden="true" />}</span>
        <span className="repository-copy"><strong>{repo.name}</strong><span>{locale === 'en' ? englishDescriptions[repo.name] ?? repo.description ?? t('No description provided.') : t(repo.description ?? 'No description provided.')}</span><small>{[repo.language, repo.fork ? t('Fork') : t('Repository'), repo.archived ? t('Archived') : null].filter(Boolean).join(' · ')}</small></span>
        <ArrowUpRight className="repository-arrow" size={18} aria-hidden="true" />
      </a>)}
    </div>
    <footer className="repository-footer"><span>{t('Static snapshot · September 20, 2026')}</span><a href={`${siteConfig.github}?tab=repositories`} target="_blank" rel="noopener noreferrer">{t('All repositories')}<ArrowUpRight size={14} aria-hidden="true" /></a></footer>
  </section>;
}
