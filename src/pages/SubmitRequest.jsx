import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Card from '../components/Card.jsx';
import Toast from '../components/Toast.jsx';
import { useRequests } from '../context/RequestsContext.jsx';
import {
  BUSINESS_UNITS,
  REQUEST_TYPES,
  IMPACT_AREAS,
  OUTPUT_FORMATS,
  PRIORITIES,
} from '../data/seedData.js';

const WORD_LIMIT = 300;

function countWords(s) {
  if (!s) return 0;
  return s.trim().split(/\s+/).filter(Boolean).length;
}

const initial = {
  title: '',
  requesterName: '',
  requesterEmail: '',
  businessUnit: '',
  deliveryDate: '',
  type: '',
  referenceAsset: '',
  businessProblem: '',
  okr: '',
  impactAreas: [],
  outputFormats: [],
  outcomeMetrics: '',
  targetUsers: '',
  dataSources: '',
  caveats: '',
  priority: '',
  clientFacing: '',
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function SubmitRequest() {
  const [form, setForm] = useState(initial);
  const [toast, setToast] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const navigate = useNavigate();
  const { addRequest, nextId } = useRequests();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const businessProblemWords = countWords(form.businessProblem);

  const requiredFields = useMemo(() => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.requesterName.trim())
      errs.requesterName = 'Requester name is required';
    if (!form.requesterEmail.trim())
      errs.requesterEmail = 'Email is required';
    if (!form.businessUnit) errs.businessUnit = 'Business unit is required';
    if (!form.type) errs.type = 'Request type is required';
    if (!form.businessProblem.trim())
      errs.businessProblem = 'Business problem is required';
    if (businessProblemWords > WORD_LIMIT)
      errs.businessProblem = `Business problem must be ≤ ${WORD_LIMIT} words`;
    if (!form.okr.trim())
      errs.okr =
        'Strategic anchor is required. A request with no OKR/KPI cannot be submitted.';
    if (!form.priority) errs.priority = 'Priority is required';
    if (!form.clientFacing) errs.clientFacing = 'Please indicate client-facing';
    return errs;
  }, [form, businessProblemWords]);

  const isValid = Object.keys(requiredFields).length === 0;

  const firstMissingMessage = useMemo(() => {
    const order = [
      'title',
      'requesterName',
      'requesterEmail',
      'businessUnit',
      'type',
      'businessProblem',
      'okr',
      'priority',
      'clientFacing',
    ];
    for (const k of order) {
      if (requiredFields[k]) return requiredFields[k];
    }
    return '';
  }, [requiredFields]);

  function toggleArr(key, val) {
    setForm((f) => {
      const arr = f[key];
      return {
        ...f,
        [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val],
      };
    });
  }

  function handleSubmit() {
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    const id = nextId();
    const submitted = todayISO();
    const newReq = {
      id,
      ...form,
      score: null,
      subScores: null,
      tier: null,
      status: 'Pending triage',
      assignee: '',
      submittedAt: submitted,
      triagedAt: '',
      activity: [
        { date: submitted, text: `Submitted by ${form.requesterName}` },
      ],
      closeNotes: '',
    };
    addRequest(newReq);
    setToast('Request submitted');
    setTimeout(() => navigate(`/request/${id}`), 350);
  }

  function handleSaveDraft() {
    setToast('Draft saved (mock — no persistence)');
  }

  return (
    <div className="mx-auto max-w-3xl px-10 py-10 pb-32">
      <PageHeader
        title="Submit a request"
        subtitle="Erco Analytics intake form"
      />

      <div className="space-y-6">
        {/* Section 1 */}
        <Card>
          <SectionHeader number={1} title="Request overview" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Title"
              required
              error={showErrors && requiredFields.title}
            >
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className={inputCls}
                placeholder="E.g. Dashboard for Solar B2B sales pipeline"
              />
            </Field>
            <Field
              label="Business unit"
              required
              error={showErrors && requiredFields.businessUnit}
            >
              <select
                value={form.businessUnit}
                onChange={(e) => set('businessUnit', e.target.value)}
                className={inputCls}
              >
                <option value="">Select…</option>
                {BUSINESS_UNITS.map((bu) => (
                  <option key={bu} value={bu}>
                    {bu}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Contact name"
              required
              error={showErrors && requiredFields.requesterName}
            >
              <input
                value={form.requesterName}
                onChange={(e) => set('requesterName', e.target.value)}
                className={inputCls}
                placeholder="E.g. Camila Restrepo"
              />
            </Field>
            <Field
              label="Contact email"
              required
              error={showErrors && requiredFields.requesterEmail}
            >
              <input
                type="email"
                value={form.requesterEmail}
                onChange={(e) => set('requesterEmail', e.target.value)}
                className={inputCls}
                placeholder="name@ercoenergia.com"
              />
            </Field>
            <Field label="Desired delivery date">
              <input
                type="date"
                value={form.deliveryDate}
                onChange={(e) => set('deliveryDate', e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>
        </Card>

        {/* Section 2 */}
        <Card>
          <SectionHeader number={2} title="Request type" />
          <div className="flex flex-wrap gap-3">
            {REQUEST_TYPES.map((t) => (
              <label
                key={t.value}
                className={
                  'cursor-pointer rounded-md border px-4 py-2 text-sm transition-colors ' +
                  (form.type === t.value
                    ? 'border-navy bg-navy text-white'
                    : 'border-cream-border bg-white text-body hover:bg-cream')
                }
              >
                <input
                  type="radio"
                  name="type"
                  className="sr-only"
                  checked={form.type === t.value}
                  onChange={() => set('type', t.value)}
                />
                {t.label}
              </label>
            ))}
          </div>
          {showErrors && requiredFields.type && (
            <p className="mt-2 text-xs text-accent">{requiredFields.type}</p>
          )}
          {form.type === 'Fix' && (
            <div className="mt-4">
              <Field label="Reference existing asset">
                <input
                  value={form.referenceAsset}
                  onChange={(e) => set('referenceAsset', e.target.value)}
                  className={inputCls}
                  placeholder="E.g. EPM Commercial Dashboard v3"
                />
              </Field>
            </div>
          )}
        </Card>

        {/* Section 3 */}
        <Card>
          <SectionHeader number={3} title="Business problem" />
          <Field
            label="What problem are you trying to solve?"
            required
            error={showErrors && requiredFields.businessProblem}
            help="Describe the problem, NOT the tool you want built. What decision are you trying to make?"
          >
            <textarea
              value={form.businessProblem}
              onChange={(e) => set('businessProblem', e.target.value)}
              rows={6}
              className={inputCls}
              placeholder="Describe the problem, NOT the tool you want built. What decision are you trying to make?"
            />
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>
                {businessProblemWords > WORD_LIMIT && (
                  <span className="text-accent">
                    Over the {WORD_LIMIT}-word limit
                  </span>
                )}
              </span>
              <span>
                {businessProblemWords} / {WORD_LIMIT} words
              </span>
            </div>
          </Field>
        </Card>

        {/* Section 4 */}
        <Card>
          <SectionHeader number={4} title="Strategic alignment" />
          <Field
            label="Which OKR or KPI does this support?"
            required
            error={showErrors && requiredFields.okr}
            help="Required. A request with no strategic anchor cannot be submitted."
          >
            <input
              value={form.okr}
              onChange={(e) => set('okr', e.target.value)}
              className={inputCls}
              placeholder="E.g. OKR Q2 — Grow B2B solar bookings by 18%"
            />
          </Field>
          <div className="mt-4">
            <Label>Impact area</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {IMPACT_AREAS.map((a) => (
                <Checkbox
                  key={a}
                  label={a}
                  checked={form.impactAreas.includes(a)}
                  onChange={() => toggleArr('impactAreas', a)}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Section 5 */}
        <Card>
          <SectionHeader number={5} title="Output requirements" />
          <Label>Output format</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {OUTPUT_FORMATS.map((o) => (
              <Checkbox
                key={o}
                label={o}
                checked={form.outputFormats.includes(o)}
                onChange={() => toggleArr('outputFormats', o)}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <Field
              label="Outcome metrics"
              help="How will you know this worked?"
            >
              <textarea
                value={form.outcomeMetrics}
                onChange={(e) => set('outcomeMetrics', e.target.value)}
                rows={3}
                className={inputCls}
                placeholder="E.g. Reduce time spent in weekly review by 50%"
              />
            </Field>
            <Field label="Target users">
              <input
                value={form.targetUsers}
                onChange={(e) => set('targetUsers', e.target.value)}
                className={inputCls}
                placeholder="E.g. B2B Sales Director, Account Managers"
              />
            </Field>
          </div>
        </Card>

        {/* Section 6 */}
        <Card>
          <SectionHeader number={6} title="Input data & assumptions" />
          <div className="grid grid-cols-1 gap-4">
            <Field label="Data sources">
              <textarea
                value={form.dataSources}
                onChange={(e) => set('dataSources', e.target.value)}
                rows={3}
                className={inputCls}
                placeholder="Where does the data live today?"
              />
            </Field>
            <Field label="Known caveats">
              <textarea
                value={form.caveats}
                onChange={(e) => set('caveats', e.target.value)}
                rows={3}
                className={inputCls}
                placeholder="Quality issues, missing fields, dependencies…"
              />
            </Field>
          </div>
        </Card>

        {/* Section 7 */}
        <Card>
          <SectionHeader number={7} title="Urgency & impact" />
          <Label>Priority</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {PRIORITIES.map((p) => (
              <label
                key={p}
                className={
                  'cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors ' +
                  (form.priority === p
                    ? 'border-navy bg-navy text-white'
                    : 'border-cream-border bg-white text-body hover:bg-cream')
                }
              >
                <input
                  type="radio"
                  name="priority"
                  className="sr-only"
                  checked={form.priority === p}
                  onChange={() => set('priority', p)}
                />
                {p}
              </label>
            ))}
          </div>
          {showErrors && requiredFields.priority && (
            <p className="mt-2 text-xs text-accent">
              {requiredFields.priority}
            </p>
          )}
          <div className="mt-5">
            <Label>Client-facing?</Label>
            <div className="mt-2 flex gap-3">
              {['Yes', 'No'].map((v) => (
                <label
                  key={v}
                  className={
                    'cursor-pointer rounded-md border px-4 py-1.5 text-sm transition-colors ' +
                    (form.clientFacing === v
                      ? 'border-navy bg-navy text-white'
                      : 'border-cream-border bg-white text-body hover:bg-cream')
                  }
                >
                  <input
                    type="radio"
                    name="clientFacing"
                    className="sr-only"
                    checked={form.clientFacing === v}
                    onChange={() => set('clientFacing', v)}
                  />
                  {v}
                </label>
              ))}
            </div>
            {showErrors && requiredFields.clientFacing && (
              <p className="mt-2 text-xs text-accent">
                {requiredFields.clientFacing}
              </p>
            )}
          </div>
        </Card>

        {/* Section 8 */}
        <Card>
          <SectionHeader number={8} title="Supporting materials" />
          <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-cream-border bg-white p-8 text-center text-sm text-muted hover:bg-cream">
            <span className="font-medium text-body">Upload files</span>
            <span>Drag &amp; drop or click to browse (mock — does nothing)</span>
            <input type="file" className="hidden" />
          </label>
        </Card>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-60 right-0 z-30 border-t border-cream-border bg-white/95 px-10 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="text-xs text-muted">
            {!isValid && (
              <span className="text-accent">
                {firstMissingMessage || 'Required fields missing'}
              </span>
            )}
            {isValid && (
              <span>All required fields complete — ready to submit.</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSaveDraft}
              className="rounded-md border border-cream-border bg-stone-200 px-4 py-2 text-sm font-medium text-body hover:bg-stone-300"
            >
              Save draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className={
                'rounded-md px-4 py-2 text-sm font-semibold text-white ' +
                (isValid
                  ? 'bg-navy hover:bg-navy/90'
                  : 'cursor-not-allowed bg-navy/40')
              }
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  );
}

const inputCls =
  'w-full rounded-md border border-cream-border bg-white px-3 py-2 text-sm text-body outline-none focus:border-navy focus:ring-1 focus:ring-navy';

function Label({ children }) {
  return (
    <span className="text-sm font-medium text-body">{children}</span>
  );
}

function Field({ label, required, error, help, children }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label>
          {label}
          {required && <span className="ml-1 text-accent">*</span>}
        </Label>
      </div>
      {help && <p className="mt-1 text-xs text-muted">{help}</p>}
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-accent">{error}</p>}
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label
      className={
        'cursor-pointer rounded-md border px-3 py-1.5 text-sm transition-colors ' +
        (checked
          ? 'border-navy bg-navy text-white'
          : 'border-cream-border bg-white text-body hover:bg-cream')
      }
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}
