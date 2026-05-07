export function TypeChip({ type }) {
  return (
    <span className="inline-flex items-center rounded-md bg-navy px-2 py-0.5 text-xs font-semibold text-white">
      {type}
    </span>
  );
}

const TIER_BG = {
  P1: 'bg-navy text-white',
  P2: 'bg-[#1E3A8A] text-white',
  P3: 'bg-[#3B82F6] text-white',
  P4: 'bg-[#9CA3AF] text-white',
};

export function TierChip({ tier }) {
  return (
    <span
      className={
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ' +
        (TIER_BG[tier] || 'bg-muted text-white')
      }
    >
      {tier}
    </span>
  );
}

const STATUS_BG = {
  'Pending triage': 'bg-amber-100 text-amber-900 border-amber-200',
  Triaged: 'bg-sky-100 text-sky-900 border-sky-200',
  'In progress': 'bg-emerald-100 text-emerald-900 border-emerald-200',
  Blocked: 'bg-rose-100 text-rose-900 border-rose-200',
  Closed: 'bg-stone-200 text-stone-700 border-stone-300',
};

export function StatusChip({ status }) {
  return (
    <span
      className={
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ' +
        (STATUS_BG[status] || 'bg-stone-100 text-stone-800 border-stone-200')
      }
    >
      {status}
    </span>
  );
}
