export type Finger =
  | "L_PINKY"
  | "L_RING"
  | "L_MIDDLE"
  | "L_INDEX"
  | "R_INDEX"
  | "R_MIDDLE"
  | "R_RING"
  | "R_PINKY"
  | "THUMB";

export type SentenceDifficulty = "easy" | "medium" | "hard";

export interface SentenceSet {
  difficulty: SentenceDifficulty;
  items: string[];
}

export interface Lesson {
  id: string;
  level: number;
  label: string;
  content: string;
}

export interface KeystrokeLog {
  ts: number;
  expectedKey: string;
  actualKey: string;
  expectedFinger: Finger;
  correct: boolean;
}

export interface SessionResult {
  lessonId: string;
  startedAt: number;
  endedAt: number;
  totalChars: number;
  correctChars: number;
  fingerErrors: number;
  problematicFinger: Finger | null;
}

export interface PersistedProgress {
  unlockedLevel: number;
  lastLessonId: string;
}
