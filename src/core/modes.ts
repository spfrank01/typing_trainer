import { Finger, Lesson } from "./types";

export type TrainerMode = "learning" | "daily_routine" | "daily_focus";

interface ModeSession {
  id: string;
  content: string;
}

const routineBase = [
  "asdf jkl; sdfj ;lkj fjfj djdj",
  "qwer uiop qq ww ee rr",
  "zxcv nm zx zx zx cv cv cv",
  "the quick brown fox jumps",
  "12345 67890 !@#$% ^&*()"
];

const weakFingerDrills: Record<Finger, string> = {
  L_PINKY: "a a a q q q z z z ; ; ;",
  L_RING: "s s s w w w x x x",
  L_MIDDLE: "d d d e e e c c c",
  L_INDEX: "f g f g r t v b",
  R_INDEX: "j h j h y u n m",
  R_MIDDLE: "k k k i i i , , ,",
  R_RING: "l l l o o o . . .",
  R_PINKY: "; ; ; p p p / / /",
  THUMB: "word word word word"
};

export function buildModeSession(params: {
  mode: TrainerMode;
  lesson: Lesson;
  lastWeakFinger: Finger | null;
}): ModeSession {
  const { mode, lesson, lastWeakFinger } = params;

  if (mode === "learning") {
    return { id: lesson.id, content: lesson.content };
  }

  if (mode === "daily_focus") {
    const weak = weakFingerDrills[lastWeakFinger ?? "R_PINKY"];
    return {
      id: "daily-focus",
      content: `asdf jkl; ${weak} ${weak} the quick brown fox`
    };
  }

  const weak = weakFingerDrills[lastWeakFinger ?? "R_PINKY"];
  return {
    id: "daily-routine",
    content: `${routineBase.join(" ")} ${weak}`
  };
}
