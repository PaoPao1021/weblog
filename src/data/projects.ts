export type ProjectStatus = 'in-progress' | 'live' | 'archived';

export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  year: number;
  stack: string[];
  github: string | null;
  demo: string | null;
  cover: string;
  featured: boolean;
  status: ProjectStatus;
  details: {
    overview: string;
    why: string;
    features: string[];
    screenshots: ProjectScreenshot[];
    lessons: string[];
  };
}

export const projects: Project[] = [
  {
    id: 'project-one',
    title: 'Project One',
    description: 'A focused workspace for turning a pile of loose thoughts into a small, useful plan.',
    year: 2026,
    stack: ['React', 'TypeScript', 'Local-first'],
    github: null,
    demo: null,
    cover: 'images/projects/project-one.svg',
    featured: true,
    status: 'in-progress',
    details: {
      overview: 'Project One is a deliberately quiet planning tool. It gives one idea a place to develop without turning every note into a task, a deadline, or a notification.',
      why: 'I wanted a workspace that feels closer to a desk than a dashboard: a place to arrange the pieces of an idea until the next useful action becomes obvious.',
      features: [
        'A single, distraction-free project canvas',
        'Small linked notes for decisions, references, and open questions',
        'A lightweight weekly rhythm instead of a permanent urgency queue',
      ],
      screenshots: [],
      lessons: [
        'A calm interface still needs clear hierarchy.',
        'The smallest interaction details decide whether a tool feels trustworthy.',
      ],
    },
  },
  {
    id: 'project-two',
    title: 'Project Two',
    description: 'A personal reading trail that preserves the context around the links worth keeping.',
    year: 2025,
    stack: ['React', 'Markdown', 'IndexedDB'],
    github: null,
    demo: null,
    cover: 'images/projects/project-two.svg',
    featured: true,
    status: 'live',
    details: {
      overview: 'Project Two collects articles, fragments, and annotations into trails rather than folders. Each saved item carries a small note about why it mattered when it was found.',
      why: 'Bookmarks answer where something is. I wanted a better answer to why I saved it, and what it might connect to later.',
      features: [
        'Reading trails arranged by question instead of source type',
        'Inline notes that stay beside the original reference',
        'Local search across titles, annotations, and tags',
      ],
      screenshots: [],
      lessons: [
        'Context is often more valuable than the saved link itself.',
        'A personal knowledge tool should make revisiting feel inviting.',
      ],
    },
  },
  {
    id: 'project-three',
    title: 'Project Three',
    description: 'A set of small interface experiments about making complex systems feel legible.',
    year: 2025,
    stack: ['CSS', 'Motion', 'Prototyping'],
    github: null,
    demo: null,
    cover: 'images/projects/project-three.svg',
    featured: true,
    status: 'archived',
    details: {
      overview: 'Project Three is an ongoing sketchbook for interface studies: transitions, controls, information density, and the moments where a product explains itself without a tutorial.',
      why: 'Prototyping isolated details is a useful way to notice the habits hidden inside familiar software.',
      features: [
        'Small, self-contained interaction studies',
        'Notes on intent, trade-offs, and accessibility',
        'A reusable collection of motion and layout patterns',
      ],
      screenshots: [],
      lessons: [
        'Motion works best when it clarifies a change.',
        'Experiments become more useful when their constraints are recorded.',
      ],
    },
  },
];

export const findProject = (id: string | undefined): Project | undefined =>
  projects.find((project) => project.id === id);
