import { NavLink } from 'react-router-dom';

const items = [
  { to: '/submit', label: 'Submit a request' },
  { to: '/triage', label: 'Triage queue' },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-60 flex-col bg-navy text-white sticky top-0">
      <div className="px-6 pt-8 pb-6">
        <div className="text-base font-bold tracking-wide leading-tight text-white">
          Erco Energía
        </div>
        <div className="mt-1 h-[2px] w-10 bg-accent" />
        <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-white/60">
          Analytics Intake
        </div>
      </div>

      <nav className="px-3 py-2 flex-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              'block rounded-md px-3 py-2 text-sm transition-colors ' +
              (isActive
                ? 'bg-white/10 text-white font-semibold'
                : 'text-white/80 hover:bg-white/5 hover:text-white')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 pb-6 pt-4 text-[11px] text-white/60">
        Erco × LBS Medellín GE 2026
      </div>
    </aside>
  );
}
