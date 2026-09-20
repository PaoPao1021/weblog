import { ArrowUpRight, AtSign, FileText, Github } from 'lucide-react';
import type { ContentProps } from '../../../app/types';
import { siteConfig } from '../../../config/site';
import { assetUrl } from '../../../utils/assets';

const sections = [
  ['01', 'Who I am', siteConfig.about.whoIAm],
  ['02', 'What I do', siteConfig.about.whatIDo],
  ['03', 'What I care about', siteConfig.about.whatICareAbout],
  ['04', 'Now', siteConfig.about.now],
] as const;

export default function About(props: ContentProps) {
  void props;
  const links = [
    { label: 'GitHub', href: siteConfig.github, icon: Github },
    { label: 'Email', href: siteConfig.email ? `mailto:${siteConfig.email}` : null, icon: AtSign },
    { label: 'Resume', href: siteConfig.resume ? assetUrl(siteConfig.resume) : null, icon: FileText },
  ];
  return <section className="content-page about-page" aria-labelledby="about-title"><header className="content-intro"><p className="content-eyebrow">About</p><h1 id="about-title">A small corner of the internet.</h1><p>I use this space to share the work, questions, and imperfect notes behind what I make.</p></header><div className="about-sections">{sections.map(([number, title, body]) => <section key={number}><span>{number}</span><div><h2>{title}</h2><p>{body}</p></div></section>)}</div><section className="about-currently" aria-labelledby="currently-title"><p className="content-eyebrow">Currently</p><h2 id="currently-title">Keeping a few threads close.</h2><dl><div><dt>Building</dt><dd>{siteConfig.currently.building}</dd></div><div><dt>Learning</dt><dd>{siteConfig.currently.learning}</dd></div><div><dt>Exploring</dt><dd>{siteConfig.currently.exploring}</dd></div></dl></section><nav className="about-links" aria-label="Personal links">{links.map(({ label, href, icon: Icon }) => href ? <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer noopener' : undefined}><Icon size={16} aria-hidden="true" />{label}<ArrowUpRight size={14} aria-hidden="true" /></a> : <span key={label} title="Add this link in src/config/site.ts"><Icon size={16} aria-hidden="true" />{label}<small>Not configured</small></span>)}</nav></section>;
}
