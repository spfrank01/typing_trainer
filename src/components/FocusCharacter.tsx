import { renderKeyLabel } from "../core/keyUtils";

interface FocusCharacterProps {
  value: string | null;
}

export function FocusCharacter({ value }: FocusCharacterProps) {
  return (
    <div className="focus-char" aria-live="polite">
      {value ? renderKeyLabel(value) : "-"}
    </div>
  );
}
