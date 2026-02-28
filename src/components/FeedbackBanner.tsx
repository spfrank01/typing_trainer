interface FeedbackBannerProps {
  type?: "correct" | "wrong" | "warning" | "info";
  message?: string;
}

export function FeedbackBanner({ type = "info", message = "Press Start to begin." }: FeedbackBannerProps) {
  return (
    <div className={`feedback-banner ${type}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
