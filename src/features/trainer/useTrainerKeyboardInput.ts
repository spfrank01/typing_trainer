import { Dispatch, useEffect } from "react";
import { isModifierKey, normalizeKey } from "../../core/keyUtils";
import { Language } from "../../core/i18n";
import { TrainerAction, TrainerState } from "./trainerReducer";

interface UseTrainerKeyboardInputParams {
  phase: TrainerState["phase"];
  language: Language;
  dispatch: Dispatch<TrainerAction>;
}

export function useTrainerKeyboardInput(params: UseTrainerKeyboardInputParams): void {
  const { phase, language, dispatch } = params;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const normalized = normalizeKey(event.key);
      if (isModifierKey(event.key)) {
        return;
      }
      if (phase !== "running") {
        return;
      }

      if (normalized === "Backspace") {
        event.preventDefault();
        dispatch({ type: "BACKSPACE", language });
        return;
      }

      if (normalized.length > 1 && normalized !== "space") {
        event.preventDefault();
        dispatch({ type: "UNSUPPORTED_KEY", key: event.key, language });
        return;
      }

      event.preventDefault();
      dispatch({ type: "HANDLE_KEY", actualKey: normalized, ts: Date.now(), language });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dispatch, language, phase]);
}
