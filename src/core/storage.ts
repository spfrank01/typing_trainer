import { PersistedProgress, SessionResult } from "./types";
import { Language } from "./i18n";
import { TrainerMode } from "./modes";

const progressKey = "tft_progress_v1";
const historyKey = "tft_history_v1";
const languageKey = "tft_language_v1";
const modeKey = "tft_mode_v1";

const defaultProgress: PersistedProgress = {
  unlockedLevel: 1,
  lastLessonId: "level-1-home-row"
};

export function loadProgress(): PersistedProgress {
  const raw = localStorage.getItem(progressKey);
  if (!raw) {
    return defaultProgress;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedProgress;
    return {
      unlockedLevel: Math.max(1, parsed.unlockedLevel || 1),
      lastLessonId: parsed.lastLessonId || defaultProgress.lastLessonId
    };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: PersistedProgress): void {
  localStorage.setItem(progressKey, JSON.stringify(progress));
}

export function loadHistory(): SessionResult[] {
  const raw = localStorage.getItem(historyKey);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as SessionResult[];
  } catch {
    return [];
  }
}

export function appendHistory(result: SessionResult): SessionResult[] {
  const history = loadHistory();
  const next = [...history, result];
  localStorage.setItem(historyKey, JSON.stringify(next));
  return next;
}

export function loadLanguage(): Language {
  const raw = localStorage.getItem(languageKey);
  if (raw === "th" || raw === "en") {
    return raw;
  }
  return "en";
}

export function saveLanguage(language: Language): void {
  localStorage.setItem(languageKey, language);
}

export function loadMode(): TrainerMode {
  const raw = localStorage.getItem(modeKey);
  if (raw === "learning" || raw === "daily_routine" || raw === "daily_focus") {
    return raw;
  }
  return "learning";
}

export function saveMode(mode: TrainerMode): void {
  localStorage.setItem(modeKey, mode);
}
