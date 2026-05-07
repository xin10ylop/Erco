export default function SectionHeader({ number, title, subtitle, className = '' }) {
  return (
    <div className={'mb-4 ' + className}>
      <div className="flex items-baseline gap-3">
        {number != null && (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Section {number}
          </span>
        )}
      </div>
      <h2 className="mt-1 text-lg font-bold text-navy">{title}</h2>
      <div className="mt-2 h-[3px] w-[50px] bg-accent" />
      {subtitle && <p className="mt-3 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
