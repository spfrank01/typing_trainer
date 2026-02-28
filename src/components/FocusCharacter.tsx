import { renderKeyLabel } from "../core/keyUtils";

interface FocusCharacterProps {
  value: string | null;
  status?: "correct" | "wrong" | "warning" | "info";
}

export function FocusCharacter({ value, status = "info" }: FocusCharacterProps) {
  const classes = ["focus-char", `is-${status}`].join(" ");
  return (
    <div className={classes} aria-live="polite">
      {value ? renderKeyLabel(value) : "-"}
    </div>
  );
}
