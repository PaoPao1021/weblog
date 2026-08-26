import Link from 'next/link';

export default function NotFound() {
  return <main className="state-page"><span>404</span><h1>这一页还没有长出来</h1><p>The page you are looking for does not exist.</p><Link className="primary-button" href="/zh">返回首页 / Home</Link></main>;
}
