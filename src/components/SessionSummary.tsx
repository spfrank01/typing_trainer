import { copy, Language } from "../core/i18n";
import { recommendationForFinger } from "../core/scoring";
import { formatFingerLabel } from "../core/layoutMap";
import { SessionResult } from "../core/types";

interface SessionSummaryProps {
  language: Language;
  result: SessionResult;
  onRestart: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export function SessionSummary({ language, result, onRestart, onNext, hasNext }: SessionSummaryProps) {
  const text = copy[language];
  const accuracy =
    result.totalChars > 0 ? ((result.totalChars - result.fingerErrors) / result.totalChars) * 100 : 0;

  return (
    <section className="summary">
      <h2>{text.sessionComplete}</h2>
      <p>
        {text.totalCharacters}: {result.totalChars}
      </p>
      <p>
        {text.fingerAccuracy}: {accuracy.toFixed(1)}%
      </p>
      <p>
        {text.mostProblematicFinger}:{" "}
        {result.problematicFinger ? formatFingerLabel(result.problematicFinger) : text.none}
      </p>
      <p>{recommendationForFinger(result.problematicFinger, language)}</p>
      <div className="summary-actions">
        <button type="button" onClick={onRestart}>
          {text.restartLesson}
        </button>
        <button type="button" disabled={!hasNext} onClick={onNext}>
          {text.nextLesson}
        </button>
      </div>
    </section>
  );
}
