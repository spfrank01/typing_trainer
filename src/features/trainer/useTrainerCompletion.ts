import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";
import { buildSessionResult } from "../../core/scoring";
import { appendHistory, saveProgress } from "../../core/storage";
import { Lesson, SessionResult } from "../../core/types";
import { TrainerMode } from "../../core/modes";
import { TrainerState } from "./trainerReducer";

interface UseTrainerCompletionParams {
  state: TrainerState;
  mode: TrainerMode;
  selectedLesson: Lesson;
  unlockedLevel: number;
  setUnlockedLevel: Dispatch<SetStateAction<number>>;
  setHistory: Dispatch<SetStateAction<SessionResult[]>>;
}

interface UseTrainerCompletionResult {
  currentResult: SessionResult | null;
  resetCompletionGuard: () => void;
}

export function useTrainerCompletion(params: UseTrainerCompletionParams): UseTrainerCompletionResult {
  const { mode, selectedLesson, setHistory, setUnlockedLevel, state, unlockedLevel } = params;
  const completedSavedRef = useRef<string | null>(null);

  const currentResult = useMemo(() => {
    if (state.phase !== "completed" || !state.startedAt || !state.endedAt) {
      return null;
    }
    return buildSessionResult({
      lessonId: state.lessonId,
      startedAt: state.startedAt,
      endedAt: state.endedAt,
      streamLength: state.stream.length,
      logs: state.keystrokes
    });
  }, [state]);

  useEffect(() => {
    if (!currentResult) {
      return;
    }

    const completionKey = `${currentResult.lessonId}-${currentResult.endedAt}`;
    if (completedSavedRef.current === completionKey) {
      return;
    }

    const nextHistory = appendHistory(currentResult);
    setHistory(nextHistory);

    if (mode !== "learning") {
      completedSavedRef.current = completionKey;
      return;
    }

    if (selectedLesson.level >= unlockedLevel) {
      const nextUnlockedLevel = Math.min(5, selectedLesson.level + 1);
      setUnlockedLevel(nextUnlockedLevel);
      saveProgress({
        unlockedLevel: nextUnlockedLevel,
        lastLessonId: selectedLesson.id
      });
    } else {
      saveProgress({
        unlockedLevel,
        lastLessonId: selectedLesson.id
      });
    }

    completedSavedRef.current = completionKey;
  }, [currentResult, mode, selectedLesson.id, selectedLesson.level, setHistory, setUnlockedLevel, unlockedLevel]);

  const resetCompletionGuard = useCallback(() => {
    completedSavedRef.current = null;
  }, []);

  return {
    currentResult,
    resetCompletionGuard
  };
}
