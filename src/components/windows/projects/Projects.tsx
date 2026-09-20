import { useState } from 'react';
import { ArrowUpRight, ChevronLeft, CircleDot, ExternalLink, Github, Layers } from 'lucide-react';
import type { ContentProps } from '../../../app/types';
import { findProject, projects, type Project } from '../../../data/projects';
import { assetUrl } from '../../../utils/assets';

const statusLabel: Record<Project['status'], string> = {
  'in-progress': 'In progress',
  live: 'Live',
  archived: 'Archive',
};

const fallbackCover = (title: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="800"><rect width="100%" height="100%" fill="#17212b"/><text x="50%" y="50%" fill="#b9d1e8" font-family="system-ui, sans-serif" font-size="42" text-anchor="middle">${title} cover unavailable</text></svg>`)}`;

function ProjectCover({ project, detail = false }: { project: Project; detail?: boolean }) {
  const alt = detail ? `${project.title} abstract interface study` : '';
  return <img className={detail ? 'project-detail-cover' : undefined} src={assetUrl(project.cover)} alt={alt} width="1600" height="800" loading="lazy" decoding="async" onError={(event) => { event.currentTarget.src = fallbackCover(project.title); event.currentTarget.alt = `${project.title} cover unavailable`; }} />;
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.github && !project.demo) return <p className="content-placeholder">Links will appear here when this placeholder project ships.</p>;
  return (
    <div className="project-links">
      {project.github && <a href={project.github} target="_blank" rel="noreferrer noopener"><Github size={16} />Source</a>}
      {project.demo && <a href={project.demo} target="_blank" rel="noreferrer noopener"><ExternalLink size={16} />Visit project</a>}
    </div>
  );
}

function ProjectDetail({ project, navigate }: { project: Project; navigate: ContentProps['navigate'] }) {
  return (
    <article className="project-detail">
      <button className="content-back" type="button" onClick={() => navigate('projects')}>
        <ChevronLeft size={17} aria-hidden="true" /> All projects
      </button>
      <ProjectCover project={project} detail />
      <div className="project-detail-heading">
        <div><p className="content-eyebrow">Selected work · {project.year}</p><h1>{project.title}</h1></div>
        <span className={`project-status project-status-${project.status}`}><CircleDot size={13} />{statusLabel[project.status]}</span>
      </div>
      <p className="project-lede">{project.description}</p>
      <section className="project-links-section"><h2>Links</h2><ProjectLinks project={project} /></section>
      <div className="project-detail-sections">
        <section><h2>Overview</h2><p>{project.details.overview}</p></section>
        <section><h2>Why I built it</h2><p>{project.details.why}</p></section>
        <section><h2>Features</h2><ul>{project.details.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
        <section><h2>Tech stack</h2><div className="content-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></section>
        <section><h2>Screenshots</h2>{project.details.screenshots.length ? <div className="project-screenshots">{project.details.screenshots.map((shot) => <figure key={shot.src}><img src={assetUrl(shot.src)} alt={shot.alt} />{shot.caption && <figcaption>{shot.caption}</figcaption>}</figure>)}</div> : <div className="project-screenshot-placeholder"><Layers size={22} /><span>In-progress visual study</span><small>Product screenshots are being prepared.</small></div>}</section>
        <section><h2>Lessons learned</h2><ul>{project.details.lessons.map((lesson) => <li key={lesson}>{lesson}</li>)}</ul></section>
      </div>
    </article>
  );
}

function ProjectIndex({ navigate }: Pick<ContentProps, 'navigate'>) {
  const [filter, setFilter] = useState<'all' | Project['status']>('all');
  const visibleProjects = projects.filter((project) => {
    if (filter === 'all') return project.featured;
    return project.status === filter;
  });

  return (
    <section className="content-page project-index" aria-labelledby="projects-title">
      <header className="content-intro"><p className="content-eyebrow">Selected work</p><h1 id="projects-title">Things I’m making room for.</h1><p>A small collection of tools and interface studies in various states of becoming.</p><span className="content-sample-note">Sample content — replace these placeholder projects with your own work.</span></header>
      <div className="note-filter" aria-label="Filter projects by status">
        <span><Layers size={14} aria-hidden="true" />Status</span>
        <button aria-pressed={filter === 'all'} className={filter === 'all' ? 'is-active' : ''} type="button" onClick={() => setFilter('all')}>All</button>
        {(['live', 'in-progress', 'archived'] as const).map((status) => (
          <button
            key={status}
            aria-pressed={filter === status}
            className={filter === status ? 'is-active' : ''}
            type="button"
            onClick={() => setFilter(status)}
          >
            {statusLabel[status]}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {visibleProjects.map((project) => <article className="project-card" key={project.id}>
          <button type="button" onClick={() => navigate('projects', project.id)} aria-label={`Read ${project.title}`}>
            <ProjectCover project={project} />
            <span className="project-card-action"><ArrowUpRight size={19} aria-hidden="true" /></span>
            <div className="project-card-copy"><div className="project-card-meta"><span>{project.year}</span><span>{statusLabel[project.status]}</span></div><h2>{project.title}</h2><p>{project.description}</p><div className="content-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div>
          </button>
          {(project.github || project.demo) && <ProjectLinks project={project} />}
        </article>)}
      </div>
    </section>
  );
}

export default function Projects({ item, navigate }: ContentProps) {
  const project = findProject(item);
  if (item && !project) return <section className="content-missing" aria-live="polite"><p className="content-eyebrow">Not found</p><h1>That project isn’t here.</h1><p>It may have moved, or this link may no longer be current.</p><button className="content-back" type="button" onClick={() => navigate('projects')}><ChevronLeft size={17} aria-hidden="true" /> Back to projects</button></section>;
  return project ? <ProjectDetail project={project} navigate={navigate} /> : <ProjectIndex navigate={navigate} />;
}
