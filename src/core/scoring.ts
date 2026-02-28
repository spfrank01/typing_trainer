import { Language, recommendationByFinger } from "./i18n";
import { Finger, KeystrokeLog, SessionResult } from "./types";

export function calculateFingerAccuracy(totalChars: number, fingerErrors: number): number {
  if (totalChars <= 0) {
    return 0;
  }

  return Math.max(0, ((totalChars - fingerErrors) / totalChars) * 100);
}

export function getProblematicFinger(logs: KeystrokeLog[]): Finger | null {
  const errorsByFinger: Partial<Record<Finger, number>> = {};

  logs.forEach((log) => {
    if (!log.correct) {
      errorsByFinger[log.expectedFinger] = (errorsByFinger[log.expectedFinger] ?? 0) + 1;
    }
  });

  let result: Finger | null = null;
  let max = -1;
  Object.entries(errorsByFinger).forEach(([finger, count]) => {
    if (count > max) {
      max = count;
      result = finger as Finger;
    }
  });

  return result;
}

export function buildSessionResult(input: {
  lessonId: string;
  startedAt: number;
  endedAt: number;
  streamLength: number;
  logs: KeystrokeLog[];
}): SessionResult {
  const fingerErrors = input.logs.filter((log) => !log.correct).length;

  return {
    lessonId: input.lessonId,
    startedAt: input.startedAt,
    endedAt: input.endedAt,
    totalChars: input.streamLength,
    correctChars: input.streamLength,
    fingerErrors,
    problematicFinger: getProblematicFinger(input.logs)
  };
}

export function recommendationForFinger(finger: Finger | null, language: Language = "en"): string {
  return recommendationByFinger(finger, language);
}
