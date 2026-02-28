import { describe, expect, it } from "vitest";
import { calculateFingerAccuracy, getProblematicFinger } from "./scoring";
import { KeystrokeLog } from "./types";

describe("scoring", () => {
  it("calculates finger accuracy", () => {
    expect(calculateFingerAccuracy(10, 2)).toBe(80);
    expect(calculateFingerAccuracy(0, 0)).toBe(0);
  });

  it("returns most problematic finger from incorrect logs", () => {
    const logs: KeystrokeLog[] = [
      {
        ts: 1,
        expectedKey: "a",
        actualKey: "s",
        expectedFinger: "L_PINKY",
        correct: false
      },
      {
        ts: 2,
        expectedKey: "a",
        actualKey: "d",
        expectedFinger: "L_PINKY",
        correct: false
      },
      {
        ts: 3,
        expectedKey: "k",
        actualKey: "k",
        expectedFinger: "R_MIDDLE",
        correct: true
      }
    ];

    expect(getProblematicFinger(logs)).toBe("L_PINKY");
  });
});
