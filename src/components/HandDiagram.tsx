import { getTrainerUiCopy, Language } from "../core/i18n";
import { formatFingerLabel } from "../core/layoutMap";
import { Finger } from "../core/types";

interface HandDiagramProps {
  activeFinger: Finger | null;
  language: Language;
  status?: "correct" | "wrong" | "warning" | "info";
}

const fingersLeft: Finger[] = ["L_PINKY", "L_RING", "L_MIDDLE", "L_INDEX"];
const fingersRight: Finger[] = ["R_INDEX", "R_MIDDLE", "R_RING", "R_PINKY"];

export function HandDiagram({ activeFinger, language, status = "info" }: HandDiagramProps) {
  const ui = getTrainerUiCopy(language);

  return (
    <section className="hand-diagram" aria-label={ui.handGuide}>
      <div className="hand-group">
        <h3>{ui.leftHand}</h3>
        <div className="finger-row">
        {fingersLeft.map((finger) => (
          <span
            key={finger}
            className={
              finger === activeFinger ? `finger is-active is-${status}` : "finger"
            }
          >
            {formatFingerLabel(finger, language)}
          </span>
        ))}
        </div>
      </div>
      <div className="hand-group">
        <h3>{ui.rightHand}</h3>
        <div className="finger-row">
        {fingersRight.map((finger) => (
          <span
            key={finger}
            className={
              finger === activeFinger ? `finger is-active is-${status}` : "finger"
            }
          >
            {formatFingerLabel(finger, language)}
          </span>
        ))}
        </div>
      </div>
    </section>
  );
}
