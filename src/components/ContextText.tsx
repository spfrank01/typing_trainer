import { memo, useMemo } from "react";
import { renderKeyLabel } from "../core/keyUtils";

interface ContextTextProps {
  stream: string[];
  cursor: number;
}

export function ContextText({ stream, cursor }: ContextTextProps) {
  const displayChars = useMemo(
    () => stream.map((char) => (renderKeyLabel(char) === "Space" ? " " : char)),
    [stream]
  );

  return (
    <p className="context-text">
      {displayChars.map((char, index) => (
        <ContextChar key={`${char}-${index}`} char={char} isActive={index === cursor} />
      ))}
    </p>
  );
}

interface ContextCharProps {
  char: string;
  isActive: boolean;
}

const ContextChar = memo(function ContextChar({ char, isActive }: ContextCharProps) {
  return <span className={isActive ? "is-active" : ""}>{char}</span>;
});
