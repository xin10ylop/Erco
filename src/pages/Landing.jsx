import { Link } from 'react-router-dom';
import Wordmark from '../components/Wordmark.jsx';

const cards = [
  {
    to: '/submit',
    heading: 'Submit a request',
    description:
      'A structured intake form that forces requesters to articulate the problem and the strategic anchor.',
  },
  {
    to: '/triage',
    heading: 'Triage queue',
    description:
      "What the Analytics Lead sees: incoming requests, weighted scores, tiers and assignment.",
  },
  {
    to: '/triage',
    heading: 'Request detail',
    description:
      'A single request after submission — the score breakdown, activity log, and outcome capture.',
    note: 'Open the queue and click any row to see this view.',
  },
];

export default function Landing() {
  return (
    <div className="mx-auto max-w-5xl px-10 py-12">
      <div className="flex items-start justify-between border-b border-cream-border pb-6">
        <Wordmark />
        <div className="text-right text-xs font-semibold uppercase tracking-wider text-muted">
          Prototype · May 2026
        </div>
      </div>

      <div className="mt-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted">
          Erco Energía
        </div>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-navy">
          Analytics Intake &amp; Prioritisation Prototype
        </h1>
        <div className="mt-3 h-[3px] w-[50px] bg-accent" />
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-body">
          Today, Erco's Analytics team receives requests through a generic
          ticketing system with almost no context — making it hard to prioritise,
          scope, or say no. This prototype demonstrates a proposed structured
          intake form, a transparent prioritisation model, and a triage workflow
          for the Analytics Lead. It is a clickable mock-up, with seed data
          only.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.heading}
            className="flex flex-col rounded-xl border border-cream-border bg-cream p-6 shadow-card"
          >
            <h3 className="text-lg font-bold text-navy">{c.heading}</h3>
            <div className="mt-2 h-[3px] w-[50px] bg-accent" />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-body">
              {c.description}
            </p>
            {c.note && (
              <p className="mt-3 text-xs italic text-muted">{c.note}</p>
            )}
            <Link
              to={c.to}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90"
            >
              Open
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Pillar
          title="Structured intake"
          body="Eight short sections force the requester to describe the problem, not the tool, and to declare the strategic anchor."
        />
        <Pillar
          title="Transparent scoring"
          body="A 4-factor weighted model — Impact, Strategic Fit, Feasibility, Risk — gives every request a score and a tier (P1–P4)."
        />
        <Pillar
          title="One queue, one owner"
          body="The Analytics Lead works a single triage queue. Every request has a status, an assignee, and a recorded outcome."
        />
      </div>

      <div className="mt-16 border-t border-cream-border pt-6 text-xs text-muted">
        Erco × LBS Medellín GE 2026
      </div>
    </div>
  );
}

function Pillar({ title, body }) {
  return (
    <div>
      <h4 className="text-sm font-bold uppercase tracking-wider text-navy">
        {title}
      </h4>
      <div className="mt-2 h-[2px] w-8 bg-accent" />
      <p className="mt-3 text-sm text-body">{body}</p>
    </div>
  );
}
