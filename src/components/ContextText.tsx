import { renderKeyLabel } from "../core/keyUtils";

interface ContextTextProps {
  stream: string[];
  cursor: number;
}

export function ContextText({ stream, cursor }: ContextTextProps) {
  return (
    <p className="context-text">
      {stream.map((char, index) => (
        <span key={`${char}-${index}`} className={index === cursor ? "is-active" : ""}>
          {renderKeyLabel(char) === "Space" ? " " : char}
        </span>
      ))}
    </p>
  );
}
