export function ScoreGauge({ score }: { score: bigint }) {
  const value = Number(score);
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      data-ocid="score_gauge"
      className="flex items-center gap-2 rounded-full bg-background/90 px-2.5 py-1.5 shadow-subtle backdrop-blur"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 48 48"
        className="-rotate-90 text-primary"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="5"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="font-mono text-xs font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}
