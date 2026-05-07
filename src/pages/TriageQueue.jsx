import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import { TypeChip, TierChip, StatusChip } from '../components/Chip.jsx';
import ScoreModal from '../components/ScoreModal.jsx';
import Toast from '../components/Toast.jsx';
import { useRequests } from '../context/RequestsContext.jsx';

const FILTERS = ['All', 'Pending triage', 'In progress', 'Closed'];

function daysBetween(iso) {
  if (!iso) return 0;
  const then = new Date(iso);
  const now = new Date('2026-05-07');
  return Math.max(0, Math.round((now - then) / (1000 * 60 * 60 * 24)));
}

export default function TriageQueue() {
  const { requests, updateRequest } = useRequests();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [scoreReq, setScoreReq] = useState(null);
  const [toast, setToast] = useState('');

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (filter !== 'All' && r.status !== filter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          r.title.toLowerCase().includes(s) ||
          r.id.toLowerCase().includes(s) ||
          r.requesterName.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [requests, filter, search]);

  const totals = useMemo(() => {
    const active = requests.filter((r) => r.status !== 'Closed').length;
    const pending = requests.filter((r) => r.status === 'Pending triage').length;
    const days = requests
      .filter((r) => r.status !== 'Closed')
      .map((r) => daysBetween(r.submittedAt));
    const avg = days.length
      ? Math.round((days.reduce((a, b) => a + b, 0) / days.length) * 10) / 10
      : 0;
    return { active, pending, avg };
  }, [requests]);

  function handleSaveScore({ scores, total, tier }) {
    if (!scoreReq) return;
    const today = new Date('2026-05-07').toISOString().slice(0, 10);
    const newActivity = [
      ...(scoreReq.activity || []),
      { date: today, text: `Scored ${tier} by Laura Henao` },
    ];
    updateRequest(scoreReq.id, {
      subScores: scores,
      score: total,
      tier,
      status: 'Triaged',
      triagedAt: today,
      activity: newActivity,
    });
    setScoreReq(null);
    setToast(`Saved score ${total.toFixed(1)} (${tier})`);
  }

  return (
    <div className="px-10 py-10">
      <PageHeader title="Triage queue" subtitle="Analytics Lead view" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard label="Total active requests" value={totals.active} />
        <SummaryCard label="Pending triage" value={totals.pending} />
        <SummaryCard
          label="Average days in queue"
          value={totals.avg}
          suffix="d"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
                (filter === f
                  ? 'border-navy bg-navy text-white'
                  : 'border-cream-border bg-white text-body hover:bg-cream')
              }
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, ID, requester…"
          className="w-72 max-w-full rounded-md border border-cream-border bg-white px-3 py-2 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-cream-border bg-white shadow-card">
        <table className="min-w-full divide-y divide-cream-border text-sm">
          <thead className="bg-cream">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Requester</Th>
              <Th>Business unit</Th>
              <Th>Type</Th>
              <Th>Submitted</Th>
              <Th>Score</Th>
              <Th>Status</Th>
              <Th>Assignee</Th>
              <Th />
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-border">
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="cursor-pointer hover:bg-cream/50"
                onClick={() => navigate(`/request/${r.id}`)}
              >
                <Td>
                  <span className="font-mono text-xs text-muted">{r.id}</span>
                </Td>
                <Td>
                  <span className="font-medium text-body">{r.title}</span>
                </Td>
                <Td>{r.requesterName}</Td>
                <Td>{r.businessUnit}</Td>
                <Td>
                  <TypeChip type={r.type} />
                </Td>
                <Td>{r.submittedAt}</Td>
                <Td>
                  {r.score != null ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="font-semibold text-navy">
                        {r.score.toFixed(1)}
                      </span>
                      <TierChip tier={r.tier} />
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </Td>
                <Td>
                  <StatusChip status={r.status} />
                </Td>
                <Td>
                  {r.assignee || <span className="text-muted">Unassigned</span>}
                </Td>
                <Td>
                  {r.status === 'Pending triage' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setScoreReq(r);
                      }}
                      className="rounded-md bg-navy px-3 py-1 text-xs font-semibold text-white hover:bg-navy/90"
                    >
                      Score this request
                    </button>
                  )}
                </Td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No requests match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ScoreModal
        open={!!scoreReq}
        request={scoreReq}
        onClose={() => setScoreReq(null)}
        onSave={handleSaveScore}
      />
      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-middle">{children}</td>;
}

function SummaryCard({ label, value, suffix }) {
  return (
    <div className="rounded-xl border border-cream-border bg-cream p-5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="mt-2 h-[2px] w-8 bg-accent" />
      <div className="mt-3 text-3xl font-bold text-navy">
        {value}
        {suffix && <span className="ml-1 text-base text-muted">{suffix}</span>}
      </div>
    </div>
  );
}
