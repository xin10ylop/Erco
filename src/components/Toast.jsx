import { useEffect } from 'react';

export default function Toast({ message, onDone, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onDone?.(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onDone]);

  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-lg border border-cream-border bg-navy px-4 py-3 text-sm text-white shadow-lg">
      {message}
    </div>
  );
}
