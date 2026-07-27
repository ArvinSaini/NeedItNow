const PageHeader = ({ eyebrow, title, accent, sub }) => (
  <div className="pb-5">
    {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
    <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
      {title} {accent && <span className="serif-accent text-primary-500">{accent}</span>}
    </h1>
    {sub && <p className="mt-1.5 text-sm text-ink-600">{sub}</p>}
  </div>
);

export default PageHeader;
