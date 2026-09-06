export default function Loading() {
  return (
    <div className="skeleton-page section-frame" aria-busy="true" aria-label="Loading">
      <div className="skeleton-block skeleton-title" />
      <div className="skeleton-block skeleton-line short" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="skeleton-row" key={index}>
          <div className="skeleton-block skeleton-visual" />
          <div className="skeleton-row-copy">
            <div className="skeleton-block skeleton-meta" />
            <div className="skeleton-block skeleton-line" />
            <div className="skeleton-block skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}
