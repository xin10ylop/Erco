export default function Card({ children, className = '', as: Tag = 'section' }) {
  return (
    <Tag
      className={
        'rounded-xl border border-cream-border bg-cream p-6 shadow-card ' +
        className
      }
    >
      {children}
    </Tag>
  );
}
