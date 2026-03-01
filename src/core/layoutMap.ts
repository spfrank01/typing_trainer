import { Language } from "./i18n";
import { Finger } from "./types";

const letterRows = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"]
] as const;

const fingerByColumn: Finger[] = [
  "L_PINKY",
  "L_RING",
  "L_MIDDLE",
  "L_INDEX",
  "L_INDEX",
  "R_INDEX",
  "R_INDEX",
  "R_MIDDLE",
  "R_RING",
  "R_PINKY"
];

const layoutMap: Record<string, Finger> = { space: "THUMB" };

letterRows.forEach((row) => {
  row.forEach((key, index) => {
    layoutMap[key] = fingerByColumn[index];
  });
});

export function getFingerForKey(key: string): Finger {
  return layoutMap[key] ?? "THUMB";
}

export function getLayoutMap(): Record<string, Finger> {
  return layoutMap;
}

export function formatFingerLabel(finger: Finger, language: Language = "en"): string {
  const labelsEn: Record<Finger, string> = {
    L_PINKY: "Left Pinky",
    L_RING: "Left Ring",
    L_MIDDLE: "Left Middle",
    L_INDEX: "Left Index",
    R_INDEX: "Right Index",
    R_MIDDLE: "Right Middle",
    R_RING: "Right Ring",
    R_PINKY: "Right Pinky",
    THUMB: "Thumb"
  };

  const labelsTh: Record<Finger, string> = {
    L_PINKY: "ก้อยซ้าย",
    L_RING: "นางซ้าย",
    L_MIDDLE: "กลางซ้าย",
    L_INDEX: "ชี้ซ้าย",
    R_INDEX: "ชี้ขวา",
    R_MIDDLE: "กลางขวา",
    R_RING: "นางขวา",
    R_PINKY: "ก้อยขวา",
    THUMB: "โป้ง"
  };

  return language === "th" ? labelsTh[finger] : labelsEn[finger];
}
