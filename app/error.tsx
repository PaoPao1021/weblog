'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="state-page"><span>!</span><h1>页面暂时没有打开</h1><p>请稍后重试，或返回首页。</p><button className="primary-button" type="button" onClick={reset}>再试一次</button></main>;
}
