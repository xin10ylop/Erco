import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Card from '../components/Card.jsx';
import { TypeChip, TierChip, StatusChip } from '../components/Chip.jsx';
import ScoreBars from '../components/ScoreBars.jsx';
import Toast from '../components/Toast.jsx';
import { useRequests } from '../context/RequestsContext.jsx';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRequest, updateRequest } = useRequests();
  const r = getRequest(id);
  const [closeText, setCloseText] = useState(r?.closeNotes || '');
  const [toast, setToast] = useState('');

  if (!r) {
    return (
      <div className="px-10 py-10">
        <PageHeader title="Request not found" subtitle="" />
        <p className="text-sm text-muted">
          We couldn't find request {id}.{' '}
          <Link to="/triage" className="text-navy underline">
            Back to triage queue
          </Link>
          .
        </p>
      </div>
    );
  }

  function handleClose() {
    const today = new Date('2026-05-07').toISOString().slice(0, 10);
    const newActivity = [
      ...(r.activity || []),
      { date: today, text: 'Closed — outcome recorded' },
    ];
    updateRequest(r.id, {
      closeNotes: closeText,
      status: 'Closed',
      activity: newActivity,
    });
    setToast('Request closed');
  }

  return (
    <div className="px-10 py-10">
      <PageHeader title="Request detail" subtitle={r.id} />

      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-xs font-medium text-muted hover:text-navy"
      >
        ← Back
      </button>

      {/* Top hero card */}
      <Card className="!p-7">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted">{r.id}</span>
              <StatusChip status={r.status} />
              <TypeChip type={r.type} />
            </div>
            <h2 className="mt-3 text-2xl font-bold text-navy">{r.title}</h2>
            <div className="mt-2 h-[3px] w-[50px] bg-accent" />
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-3">
              <Meta label="Requester" value={r.requesterName} />
              <Meta label="Business unit" value={r.businessUnit} />
              <Meta label="Priority" value={r.priority} />
            </div>
          </div>

          <div className="w-full max-w-sm rounded-lg border border-cream-border bg-white p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Weighted score
            </div>
            <div className="mt-1 flex items-baseline gap-3">
              {r.score != null ? (
                <>
                  <div className="text-3xl font-bold text-navy">
                    {r.score.toFixed(1)}
                  </div>
                  <span className="text-muted">—</span>
                  <TierChip tier={r.tier} />
                </>
              ) : (
                <div className="text-sm text-muted">Not yet scored</div>
              )}
            </div>
            {r.subScores && (
              <div className="mt-4">
                <ScoreBars subScores={r.subScores} />
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Read-only sections (left, 2 cols) */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <SectionHeader number={1} title="Request overview" />
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <ReadField label="Title" value={r.title} />
              <ReadField label="Business unit" value={r.businessUnit} />
              <ReadField label="Contact name" value={r.requesterName} />
              <ReadField label="Contact email" value={r.requesterEmail} />
              <ReadField
                label="Desired delivery date"
                value={r.deliveryDate || '—'}
              />
            </div>
          </Card>

          <Card>
            <SectionHeader number={2} title="Request type" />
            <div className="flex items-center gap-3 text-sm">
              <TypeChip type={r.type} />
              {r.type === 'Fix' && r.referenceAsset && (
                <span className="text-muted">
                  Reference: <span className="text-body">{r.referenceAsset}</span>
                </span>
              )}
            </div>
          </Card>

          <Card>
            <SectionHeader number={3} title="Business problem" />
            <p className="whitespace-pre-line text-sm leading-relaxed text-body">
              {r.businessProblem}
            </p>
          </Card>

          <Card>
            <SectionHeader number={4} title="Strategic alignment" />
            <ReadField label="OKR / KPI" value={r.okr} />
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                Impact areas
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {(r.impactAreas?.length ? r.impactAreas : ['—']).map((a) => (
                  <span
                    key={a}
                    className="inline-flex rounded-md border border-cream-border bg-white px-2 py-1 text-xs text-body"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <SectionHeader number={5} title="Output requirements" />
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Output format
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(r.outputFormats?.length ? r.outputFormats : ['—']).map((o) => (
                <span
                  key={o}
                  className="inline-flex rounded-md border border-cream-border bg-white px-2 py-1 text-xs text-body"
                >
                  {o}
                </span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 text-sm">
              <ReadField label="Outcome metrics" value={r.outcomeMetrics} />
              <ReadField label="Target users" value={r.targetUsers} />
            </div>
          </Card>

          <Card>
            <SectionHeader number={6} title="Input data & assumptions" />
            <div className="grid grid-cols-1 gap-4 text-sm">
              <ReadField label="Data sources" value={r.dataSources} />
              <ReadField label="Known caveats" value={r.caveats || '—'} />
            </div>
          </Card>

          <Card>
            <SectionHeader number={7} title="Urgency & impact" />
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <ReadField label="Priority" value={r.priority} />
              <ReadField label="Client-facing" value={r.clientFacing} />
            </div>
          </Card>

          <Card>
            <SectionHeader number={8} title="Supporting materials" />
            <p className="text-sm text-muted">
              No files attached (mock prototype).
            </p>
          </Card>

          <Card>
            <SectionHeader title="Close request" />
            <p className="text-sm text-muted">
              Did the KPI move? Record the outcome.
            </p>
            <textarea
              value={closeText}
              onChange={(e) => setCloseText(e.target.value)}
              rows={4}
              disabled={r.status === 'Closed'}
              placeholder={
                r.status === 'Closed'
                  ? ''
                  : 'E.g. Pipeline review time dropped from 90 to 35 minutes.'
              }
              className="mt-3 w-full rounded-md border border-cream-border bg-white px-3 py-2 text-sm text-body outline-none focus:border-navy focus:ring-1 focus:ring-navy disabled:bg-cream"
            />
            {r.status !== 'Closed' && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handleClose}
                  disabled={!closeText.trim()}
                  className={
                    'rounded-md px-4 py-2 text-sm font-semibold text-white ' +
                    (closeText.trim()
                      ? 'bg-navy hover:bg-navy/90'
                      : 'cursor-not-allowed bg-navy/40')
                  }
                >
                  Close request
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <Card>
            <SectionHeader title="Assignment" />
            <div className="space-y-3 text-sm">
              <Meta
                label="Assigned analyst"
                value={r.assignee || 'Unassigned'}
              />
              <Meta label="Submitted" value={r.submittedAt} />
              <Meta label="Triaged" value={r.triagedAt || '—'} />
              <Meta
                label="Target delivery"
                value={r.deliveryDate || '—'}
              />
            </div>
          </Card>

          <Card>
            <SectionHeader title="Activity log" />
            <ol className="space-y-3 text-sm">
              {(r.activity || []).map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-navy" />
                  <div className="min-w-0">
                    <div className="text-body">{a.text}</div>
                    <div className="text-xs text-muted">{a.date}</div>
                  </div>
                </li>
              ))}
              {(!r.activity || r.activity.length === 0) && (
                <li className="text-sm text-muted">No activity yet.</li>
              )}
            </ol>
          </Card>
        </div>
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-body">{value}</div>
    </div>
  );
}

function ReadField({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div className="mt-1 whitespace-pre-line text-sm text-body">
        {value || '—'}
      </div>
    </div>
  );
}
