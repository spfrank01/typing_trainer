import { getTrainerUiCopy, Language } from "../core/i18n";
import { formatFingerLabel, getLayoutMap } from "../core/layoutMap";
import { Finger } from "../core/types";
import { renderKeyLabel } from "../core/keyUtils";

interface KeyboardViewProps {
  expectedKey: string | null;
  language: Language;
  status?: "correct" | "wrong" | "warning" | "info";
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

const legendOrder: Finger[] = [
  "L_PINKY",
  "L_RING",
  "L_MIDDLE",
  "L_INDEX",
  "R_INDEX",
  "R_MIDDLE",
  "R_RING",
  "R_PINKY"
];

export function KeyboardView({ expectedKey, language, status = "info" }: KeyboardViewProps) {
  const map = getLayoutMap();
  const ui = getTrainerUiCopy(language);

  return (
    <section className="keyboard-view" aria-label={ui.keyboardMap}>
      <div className="keyboard-legend">
        <span className="legend-title">{ui.keyboardLegendTitle}</span>
        <div className="legend-items">
          {legendOrder.map((finger) => (
            <span key={finger} className={`legend-dot ${fingerClass[finger]}`}>
              {formatFingerLabel(finger, language)}
            </span>
          ))}
        </div>
      </div>
      {rows.map((row, rowIndex) => (
        <div className="key-row" key={`row-${rowIndex}`}>
          {row.map((key) => {
            const finger = map[key] ?? "THUMB";
            const classes = [
              "key-cap",
              fingerClass[finger],
              expectedKey === key ? "is-active" : "",
              expectedKey === key ? `is-${status}` : ""
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
