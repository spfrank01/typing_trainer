import { memo, useMemo } from "react";
import { renderKeyLabel } from "../core/keyUtils";

export type ContextTextMode = "focus_window" | "full_paragraph" | "centered_cursor";

interface ContextTextProps {
  stream: string[];
  cursor: number;
  mode?: ContextTextMode;
}

const WINDOW_SIZE = 80;
const CENTERED_WINDOW_SIZE = 56;
const LOOK_BEHIND = 20;
const WINDOW_STEP = 5;

export function ContextText({ stream, cursor, mode = "focus_window" }: ContextTextProps) {
  const displayChars = useMemo(
    () => stream.map((char) => (renderKeyLabel(char) === "Space" ? " " : char)),
    [stream]
  );
  const visibleWindow = useMemo(() => {
    if (mode === "full_paragraph") {
      return { start: 0, end: displayChars.length };
    }

    if (mode === "centered_cursor") {
      const maxStart = Math.max(0, displayChars.length - CENTERED_WINDOW_SIZE);
      const halfWindow = Math.floor(CENTERED_WINDOW_SIZE / 2);
      const start = Math.max(0, Math.min(cursor - halfWindow, maxStart));
      const end = Math.min(displayChars.length, start + CENTERED_WINDOW_SIZE);
      return { start, end };
    }

    const maxStart = Math.max(0, displayChars.length - WINDOW_SIZE);
    const desiredStart = Math.max(0, Math.min(cursor - LOOK_BEHIND, maxStart));
    const snappedStart = Math.floor(desiredStart / WINDOW_STEP) * WINDOW_STEP;
    const start = Math.max(0, Math.min(snappedStart, maxStart));
    const end = Math.min(displayChars.length, start + WINDOW_SIZE);

    return { start, end };
  }, [cursor, displayChars.length, mode]);

  const visibleChars = useMemo(
    () => displayChars.slice(visibleWindow.start, visibleWindow.end),
    [displayChars, visibleWindow.end, visibleWindow.start]
  );

  return (
    <p
      className={`context-text ${
        mode === "focus_window"
          ? "is-focus-window"
          : mode === "centered_cursor"
            ? "is-centered-cursor"
            : "is-full-paragraph"
      }`}
    >
      {visibleChars.map((char, localIndex) => {
        const absoluteIndex = visibleWindow.start + localIndex;
        return (
          <ContextChar
            key={`${char}-${absoluteIndex}`}
            char={char}
            isActive={absoluteIndex === cursor}
            isPast={absoluteIndex < cursor}
          />
        );
      })}
    </p>
  );
}

interface ContextCharProps {
  char: string;
  isActive: boolean;
  isPast: boolean;
}

const ContextChar = memo(function ContextChar({ char, isActive, isPast }: ContextCharProps) {
  const className = isActive ? "is-active" : isPast ? "is-past" : "";
  return <span className={className}>{char}</span>;
});
