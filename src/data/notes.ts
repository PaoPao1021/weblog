export interface Note {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
}

export const notes: Note[] = [
  {
    id: 'designing-for-focus',
    title: 'Designing for focus, not attention',
    description: 'A few constraints that keep a tool from competing with the work it is meant to support.',
    date: '2026-09-14',
    tags: ['Design', 'Thoughts'],
    content: `A useful tool should make the next step easier to see. It does not need to be loud to be memorable.

## The interface has a metabolism

Every badge, animation, and prompt asks for a moment of attention. That is not automatically a problem, but it is a cost. The best interactions earn that cost by helping someone make a decision or notice a change.

> Calm is not the absence of information. It is the presence of a clear next question.

I have been using three checks when making a screen:

1. Can the important thing be found without scanning every card?
2. Does motion explain what changed?
3. Could this interruption wait until the person asks for it?

The answers are rarely perfect. They do make the trade-offs visible.`,
  },
  {
    id: 'small-tools-lasting-impact',
    title: 'Small tools, lasting impact',
    description: 'Why narrow software can create more room than another all-in-one workspace.',
    date: '2026-08-29',
    tags: ['Development', 'Thoughts'],
    content: `There is a particular pleasure in a tool that does one thing well. It leaves room for people to keep their own methods instead of asking them to adopt a complete worldview.

## A smaller surface has benefits

- Fewer choices to explain
- A shorter path from intention to result
- More care available for the details that remain

This does not mean every product should be tiny. It means the boundary deserves as much design attention as the feature list. A useful constraint can be a feature in its own right.`,
  },
  {
    id: 'working-with-ai-as-material',
    title: 'Working with AI as material',
    description: 'A note on treating generative systems as a medium for iteration, not an oracle for answers.',
    date: '2026-08-12',
    tags: ['AI', 'Learning'],
    content: `Generative systems are most interesting to me when they make variation cheap. They can turn a rough thought into several possible shapes, which creates something to react to.

## Keep a hand on the steering wheel

The useful work is often before and after the prompt: deciding what deserves attention, identifying what feels wrong, and carrying the result into a real context.

\`\`\`ts
const goodResult = draft
  .generateOptions()
  .filter(matchesIntent)
  .refineWithContext();
\`\`\`

The code is a metaphor, but the sequence matters. Generation is not judgment.`,
  },
  {
    id: 'the-shape-of-a-good-default',
    title: 'The shape of a good default',
    description: 'Defaults are quiet product decisions that should feel helpful without becoming sticky assumptions.',
    date: '2026-07-26',
    tags: ['Design', 'Development'],
    content: `A default is a suggestion made on behalf of a future person. It should be easy to understand, easy to change, and good enough that most people never need to think about it.

## Three qualities

| Quality | Question |
| --- | --- |
| Legible | Can people tell what will happen? |
| Reversible | Can they recover from a wrong choice? |
| Respectful | Does it fit a common intent without trapping anyone there? |

Defaults become harmful when they hide an important product decision behind convenience.`,
  },
  {
    id: 'learning-in-public-without-performing',
    title: 'Learning in public without performing',
    description: 'Notes on sharing unfinished work in a way that stays useful to the person doing it.',
    date: '2026-07-03',
    tags: ['Learning', 'Thoughts'],
    content: `Sharing a work-in-progress can create a generous record of how an idea changed. It can also turn every sketch into a performance.

The difference is in the audience. I try to write notes I would want to meet again six months from now: specific enough to be useful, unfinished enough to leave room for revision.

## A practical rule

Publish the question, the constraint, and the thing that changed your mind. Leave out the pressure to sound complete.`,
  },
  {
    id: 'a-reading-practice-for-the-open-web',
    title: 'A reading practice for the open web',
    description: 'A lightweight way to return to the pieces that keep echoing after the tab is closed.',
    date: '2026-06-18',
    tags: ['Learning', 'Development'],
    content: `Reading online gets better when saving something takes slightly more care than opening it. A short annotation creates a thread back to the moment of discovery.

## My current practice

1. Save only what I would revisit.
2. Add one sentence about why it matters now.
3. Connect it to a question, not a topic.
4. Review a few trails when beginning a related project.

The result is less like an archive and more like a conversation with earlier versions of myself.`,
  },
];

export const findNote = (id: string | undefined): Note | undefined =>
  notes.find((note) => note.id === id);
