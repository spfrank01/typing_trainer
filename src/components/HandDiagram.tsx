import { formatFingerLabel } from "../core/layoutMap";
import { Finger } from "../core/types";

interface HandDiagramProps {
  activeFinger: Finger | null;
}

const fingersLeft: Finger[] = ["L_PINKY", "L_RING", "L_MIDDLE", "L_INDEX"];
const fingersRight: Finger[] = ["R_INDEX", "R_MIDDLE", "R_RING", "R_PINKY"];

export function HandDiagram({ activeFinger }: HandDiagramProps) {
  return (
    <section className="hand-diagram" aria-label="Finger guide">
      <div className="hand-group">
        {fingersLeft.map((finger) => (
          <span key={finger} className={finger === activeFinger ? "finger is-active" : "finger"}>
            {formatFingerLabel(finger)}
          </span>
        ))}
      </div>
      <div className="hand-group">
        {fingersRight.map((finger) => (
          <span key={finger} className={finger === activeFinger ? "finger is-active" : "finger"}>
            {formatFingerLabel(finger)}
          </span>
        ))}
      </div>
    </section>
  );
}
