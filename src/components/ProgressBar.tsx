interface ProgressBarProps {
  progressPercent: number;
}

export function ProgressBar({ progressPercent }: ProgressBarProps) {
  return (
    <div className="progress-wrap" aria-label="Progress">
      <div className="progress-bar" style={{ width: `${Math.min(100, progressPercent)}%` }} />
      <span className="progress-label">{Math.round(progressPercent)}%</span>
    </div>
  );
}
