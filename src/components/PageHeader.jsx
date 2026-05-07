export default function PageHeader({ title, subtitle }) {
  return (
    <div className="flex items-start justify-between border-b border-cream-border pb-6 mb-8">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">
          Erco Energía
        </div>
        <div className="mt-1 h-[2px] w-10 bg-accent" />
      </div>
      <div className="text-right">
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
