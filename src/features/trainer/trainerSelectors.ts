import { calculateFingerAccuracy } from "../../core/scoring";
import { TrainerState } from "./trainerReducer";

export function getExpectedKey(state: TrainerState): string | null {
  return state.stream[state.cursor] ?? null;
}

export function getProgressPercent(state: TrainerState): number {
  if (state.stream.length === 0) {
    return 0;
  }
  return (state.cursor / state.stream.length) * 100;
}

export function getFingerAccuracy(state: TrainerState): number {
  const total = state.keystrokes.length;
  const errors = state.keystrokes.filter((log) => !log.correct).length;
  return calculateFingerAccuracy(total, errors);
}
