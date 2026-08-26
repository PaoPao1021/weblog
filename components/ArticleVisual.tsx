import type { Post } from '@/lib/posts';

export function ArticleVisual({ post }: { post: Post }) {
  return (
    <div className={`article-visual visual-${post.accent}`} aria-hidden="true">
      {post.visual === 'window' && <div className="mini-window"><span>•••</span><i /><i /><i /></div>}
      {post.visual === 'steps' && <div className="mini-steps"><i /><i /><i /><i /></div>}
      {post.visual === 'sun' && <div className="mini-sun"><i /><span>07</span></div>}
      {post.visual === 'orbit' && <div className="mini-orbit"><i /><i /><span /></div>}
    </div>
  );
}
