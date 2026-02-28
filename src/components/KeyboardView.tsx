import { getLayoutMap } from "../core/layoutMap";
import { Finger } from "../core/types";
import { renderKeyLabel } from "../core/keyUtils";

interface KeyboardViewProps {
  expectedKey: string | null;
}

const rows = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ["space"]
];

const fingerClass: Record<Finger, string> = {
  L_PINKY: "l-pinky",
  L_RING: "l-ring",
  L_MIDDLE: "l-middle",
  L_INDEX: "l-index",
  R_INDEX: "r-index",
  R_MIDDLE: "r-middle",
  R_RING: "r-ring",
  R_PINKY: "r-pinky",
  THUMB: "thumb"
};

export function KeyboardView({ expectedKey }: KeyboardViewProps) {
  const map = getLayoutMap();

  return (
    <section className="keyboard-view" aria-label="Keyboard map">
      {rows.map((row, rowIndex) => (
        <div className="key-row" key={`row-${rowIndex}`}>
          {row.map((key) => {
            const finger = map[key] ?? "THUMB";
            const classes = [
              "key-cap",
              fingerClass[finger],
              expectedKey === key ? "is-active" : ""
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <span key={key} className={classes}>
                {renderKeyLabel(key)}
              </span>
            );
          })}
        </div>
      ))}
    </section>
  );
}
