const LABELS = {
  impact: 'Impact',
  strategicFit: 'Strategic Fit',
  feasibility: 'Feasibility',
  risk: 'Risk',
};

export default function ScoreBars({ subScores }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {Object.entries(LABELS).map(([key, label]) => {
        const v = subScores?.[key] ?? 0;
        return (
          <div key={key} className="flex items-center gap-3 text-sm">
            <div className="w-24 text-muted">{label}</div>
            <div className="flex-1 h-2 rounded-full bg-cream-border overflow-hidden">
              <div
                className="h-full bg-navy"
                style={{ width: `${(v / 5) * 100}%` }}
              />
            </div>
            <div className="w-8 text-right font-semibold text-navy">{v}</div>
          </div>
        );
      })}
    </div>
  );
}
