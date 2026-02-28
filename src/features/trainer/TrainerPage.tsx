import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ContextText } from "../../components/ContextText";
import { FocusCharacter } from "../../components/FocusCharacter";
import { HandDiagram } from "../../components/HandDiagram";
import { KeyboardView } from "../../components/KeyboardView";
import { ProgressBar } from "../../components/ProgressBar";
import { SessionSummary } from "../../components/SessionSummary";
import { getLessonById, getLessons } from "../../core/lessons";
import { copy, getLessonLabel, languageOptions, Language } from "../../core/i18n";
import { getFingerForKey } from "../../core/layoutMap";
import { fromContentToStream, isModifierKey, normalizeKey } from "../../core/keyUtils";
import { buildModeSession, TrainerMode } from "../../core/modes";
import { buildSessionResult } from "../../core/scoring";
import {
  appendHistory,
  loadHistory,
  loadLanguage,
  loadMode,
  loadProgress,
  saveLanguage,
  saveMode,
  saveProgress
} from "../../core/storage";
import { SessionResult } from "../../core/types";
import { getExpectedKey, getFingerAccuracy, getProgressPercent } from "./trainerSelectors";
import { initialTrainerState, trainerReducer } from "./trainerReducer";

export function TrainerPage() {
  const lessons = getLessons();
  const persisted = loadProgress();
  const [language, setLanguage] = useState<Language>(() => loadLanguage());
  const [mode, setMode] = useState<TrainerMode>(() => loadMode());
  const [selectedLessonId, setSelectedLessonId] = useState<string>(persisted.lastLessonId);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(persisted.unlockedLevel);
  const [history, setHistory] = useState<SessionResult[]>(() => loadHistory());
  const [state, dispatch] = useReducer(trainerReducer, initialTrainerState);
  const completedSavedRef = useRef<string | null>(null);

  const selectedLesson = useMemo(
    () => getLessonById(selectedLessonId) ?? lessons[0],
    [lessons, selectedLessonId]
  );

  const expectedKey = getExpectedKey(state);
  const expectedFinger = expectedKey ? getFingerForKey(expectedKey) : null;
  const progressPercent = getProgressPercent(state);
  const fingerAccuracy = getFingerAccuracy(state);
  const text = copy[language];
  const streakDays = useMemo(() => computeStreak(history), [history]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const normalized = normalizeKey(event.key);
      if (isModifierKey(event.key)) {
        return;
      }
      if (state.phase !== "running") {
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
  }, [language, state.phase]);

  useEffect(() => {
    if (state.phase !== "completed" || !state.startedAt || !state.endedAt) {
      return;
    }
    const completionKey = `${state.lessonId}-${state.endedAt}`;
    if (completedSavedRef.current === completionKey) {
      return;
    }

    const result = buildSessionResult({
      lessonId: state.lessonId,
      startedAt: state.startedAt,
      endedAt: state.endedAt,
      streamLength: state.stream.length,
      logs: state.keystrokes
    });
    const nextHistory = appendHistory(result);
    setHistory(nextHistory);

    if (mode !== "learning") {
      completedSavedRef.current = completionKey;
      return;
    }

    if (selectedLesson.level >= unlockedLevel) {
      setUnlockedLevel(Math.min(5, selectedLesson.level + 1));
      saveProgress({
        unlockedLevel: Math.min(5, selectedLesson.level + 1),
        lastLessonId: selectedLesson.id
      });
    } else {
      saveProgress({
        unlockedLevel,
        lastLessonId: selectedLesson.id
      });
    }

    completedSavedRef.current = completionKey;
  }, [mode, selectedLesson, state, unlockedLevel]);

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

  const availableLessons = lessons.filter((lesson) => lesson.level <= unlockedLevel);
  const lastWeakFinger = history.length > 0 ? history[history.length - 1].problematicFinger : null;
  const startLabel = state.phase === "running" ? text.restart : text.start;

  function startLesson(lessonId: string) {
    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return;
    }
    completedSavedRef.current = null;
    const session = buildModeSession({
      mode,
      lesson,
      lastWeakFinger
    });
    dispatch({
      type: "START_LESSON",
      lessonId: session.id,
      stream: fromContentToStream(session.content),
      startedAt: Date.now(),
      language
    });
  }

  function goToNextLesson() {
    if (mode !== "learning") {
      startLesson(selectedLesson.id);
      return;
    }
    const currentIndex = lessons.findIndex((lesson) => lesson.id === selectedLesson.id);
    const nextLesson = lessons[currentIndex + 1];
    if (!nextLesson || nextLesson.level > unlockedLevel) {
      return;
    }
    setSelectedLessonId(nextLesson.id);
    startLesson(nextLesson.id);
  }

  return (
    <main className="trainer-page">
      <header className="header-bar">
        <h1>{text.appTitle}</h1>
      </header>

      <section className="control-bar">
        <div className="lesson-controls">
          <label htmlFor="mode">{text.mode}</label>
          <select
            id="mode"
            value={mode}
            onChange={(event) => {
              const nextMode = event.target.value as TrainerMode;
              setMode(nextMode);
              saveMode(nextMode);
            }}
          >
            <option value="learning">{text.modes.learning}</option>
            <option value="daily_routine">{text.modes.daily_routine}</option>
            <option value="daily_focus">{text.modes.daily_focus}</option>
          </select>
          <label htmlFor="lesson">{text.lesson}</label>
          <select
            id="lesson"
            value={selectedLesson.id}
            disabled={mode !== "learning"}
            onChange={(event) => setSelectedLessonId(event.target.value)}
          >
            {availableLessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {getLessonLabel(language, lesson.id, lesson.label)}
              </option>
            ))}
          </select>
          <label htmlFor="language">{text.language}</label>
          <select
            id="language"
            value={language}
            onChange={(event) => {
              const nextLanguage = event.target.value as Language;
              setLanguage(nextLanguage);
              saveLanguage(nextLanguage);
            }}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => startLesson(selectedLesson.id)}>
            {startLabel}
          </button>
        </div>
      </section>

      <ProgressBar progressPercent={progressPercent} />

      {currentResult ? (
        <SessionSummary
          language={language}
          result={currentResult}
          onRestart={() => startLesson(selectedLesson.id)}
          onNext={goToNextLesson}
          hasNext={mode === "learning" && selectedLesson.level < unlockedLevel}
        />
      ) : (
        <>
          <section className="focus-panel">
            <FocusCharacter value={expectedKey} status={state.lastFeedback?.type} />
            <p className="metric">
              {text.fingerAccuracy}: {fingerAccuracy.toFixed(1)}%
            </p>
            <p className={`focus-feedback ${state.lastFeedback?.type ?? "info"}`}>
              {state.lastFeedback?.message ?? text.pressStart}
            </p>
          </section>
          <section className="train-core">
            <ContextText stream={state.stream} cursor={state.cursor} />
            <HandDiagram activeFinger={expectedFinger} />
            <KeyboardView expectedKey={expectedKey} />
          </section>
        </>
      )}

      <footer className="status-bar">
        <p className="status-chip">
          {text.unlockedLevel}: {unlockedLevel}
        </p>
        <p className="status-chip">
          {text.completedSessions}: {history.length}
        </p>
        <p className="status-chip">
          {text.streak}: {streakDays} {text.dayUnit}
        </p>
      </footer>
    </main>
  );
}

function computeStreak(history: SessionResult[]): number {
  if (history.length === 0) {
    return 0;
  }

  const toDayId = (timestamp: number): number => {
    const date = new Date(timestamp);
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const uniqueDays = Array.from(
    new Set(history.map((item) => toDayId(item.endedAt)).sort((a, b) => a - b))
  ) as number[];

  let streak = 1;
  for (let i = uniqueDays.length - 1; i > 0; i -= 1) {
    const current = uniqueDays[i];
    const previous = uniqueDays[i - 1];
    const diffDays = Math.round((current - previous) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  const deltaFromToday = Math.round(
    (toDayId(Date.now()) - uniqueDays[uniqueDays.length - 1]) / (1000 * 60 * 60 * 24)
  );

  if (deltaFromToday > 1) {
    return 0;
  }
  return streak;
}
