export default function Wordmark({ tone = 'navy' }) {
  const isWhite = tone === 'white';
  return (
    <div className="select-none">
      <div
        className={
          'text-[13px] font-semibold tracking-wide leading-tight ' +
          (isWhite ? 'text-white' : 'text-navy')
        }
      >
        London Business School
      </div>
      <div className="mt-1 h-[2px] w-10 bg-accent" />
    </div>
  );
}
