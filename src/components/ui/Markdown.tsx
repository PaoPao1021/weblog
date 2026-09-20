import { Check, Copy } from 'lucide-react';
import { isValidElement, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
}

function CodeBlock({ className, children }: { className?: string; children?: ReactNode }) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const code = String(children).replace(/\n$/, '');
  const language = className?.replace('language-', '') || 'text';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1600);
    } catch {
      setCopyState('failed');
      window.setTimeout(() => setCopyState('idle'), 2200);
    }
  };

  return (
    <div className="prose-codeblock">
      <div className="prose-codebar">
        <span>{language}</span>
        <button type="button" onClick={copy} aria-label="Copy code">
          {copyState === 'copied' ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copyState === 'copied' ? 'Copied' : copyState === 'failed' ? 'Could not copy' : 'Copy'}
        </button>
      </div>
      <pre><code className={className}>{children}</code></pre>
    </div>
  );
}

export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre({ children }) {
            if (isValidElement(children)) {
              const codeChild = children as ReactElement<{ className?: string; children?: ReactNode }>;
              return <CodeBlock className={codeChild.props.className}>{codeChild.props.children}</CodeBlock>;
            }
            return <pre>{children}</pre>;
          },
          code({ children, ...props }) {
            return <code {...props}>{children}</code>;
          },
          a({ href, children }) {
            const external = href?.startsWith('http');
            return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
