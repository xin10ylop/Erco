import { useEffect, useState } from 'react';
import { calcWeightedScore, tierFromScore } from '../data/seedData.js';
import { TierChip } from './Chip.jsx';

const FIELDS = [
  { key: 'impact', label: 'Impact', weight: 0.35 },
  { key: 'strategicFit', label: 'Strategic Fit', weight: 0.3 },
  { key: 'feasibility', label: 'Feasibility', weight: 0.2 },
  { key: 'risk', label: 'Risk', weight: 0.15 },
];

export default function ScoreModal({ open, request, onClose, onSave }) {
  const [scores, setScores] = useState({
    impact: 3,
    strategicFit: 3,
    feasibility: 3,
    risk: 3,
  });

  useEffect(() => {
    if (open && request) {
      setScores({
        impact: request.subScores?.impact ?? 3,
        strategicFit: request.subScores?.strategicFit ?? 3,
        feasibility: request.subScores?.feasibility ?? 3,
        risk: request.subScores?.risk ?? 3,
      });
    }
  }, [open, request]);

  if (!open || !request) return null;

  const total = calcWeightedScore(scores);
  const tier = tierFromScore(total);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl border border-cream-border bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Score this request
            </div>
            <h3 className="mt-1 text-lg font-bold text-navy">
              {request.id} — {request.title}
            </h3>
            <div className="mt-2 h-[3px] w-[50px] bg-accent" />
          </div>
          <button
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-muted hover:bg-cream"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <div className="flex items-center justify-between text-sm">
                <label className="font-medium text-body">
                  {f.label}{' '}
                  <span className="text-muted">
                    ({Math.round(f.weight * 100)}%)
                  </span>
                </label>
                <span className="font-semibold text-navy">
                  {scores[f.key]}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scores[f.key]}
                onChange={(e) =>
                  setScores((s) => ({ ...s, [f.key]: Number(e.target.value) }))
                }
                className="mt-2 w-full"
              />
              <div className="mt-1 flex justify-between text-[11px] text-muted">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-lg border border-cream-border bg-cream p-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">
              Weighted score
            </div>
            <div className="mt-1 text-2xl font-bold text-navy">
              {total.toFixed(1)}
              <span className="ml-2 align-middle">
                <TierChip tier={tier} />
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-muted">
            Impact 35% · Strategic Fit 30%
            <br />
            Feasibility 20% · Risk 15%
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-cream-border bg-white px-4 py-2 text-sm font-medium text-body hover:bg-cream"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ scores, total, tier })}
            className="rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
