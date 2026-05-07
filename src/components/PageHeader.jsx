import Wordmark from './Wordmark.jsx';

export default function PageHeader({ title, subtitle }) {
  return (
    <div className="flex items-start justify-between border-b border-cream-border pb-6 mb-8">
      <Wordmark />
      <div className="text-right">
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
