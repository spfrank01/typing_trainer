import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ContextText } from "../../components/ContextText";
import { FeedbackBanner } from "../../components/FeedbackBanner";
import { FocusCharacter } from "../../components/FocusCharacter";
import { HandDiagram } from "../../components/HandDiagram";
import { KeyboardView } from "../../components/KeyboardView";
import { ProgressBar } from "../../components/ProgressBar";
import { SessionSummary } from "../../components/SessionSummary";
import { getLessonById, getLessons } from "../../core/lessons";
import { copy, getLessonLabel, languageOptions, Language } from "../../core/i18n";
import { getFingerForKey } from "../../core/layoutMap";
import { fromContentToStream, isModifierKey, normalizeKey } from "../../core/keyUtils";
import { buildSessionResult } from "../../core/scoring";
import {
  appendHistory,
  loadHistory,
  loadLanguage,
  loadProgress,
  saveLanguage,
  saveProgress
} from "../../core/storage";
import { SessionResult } from "../../core/types";
import { getExpectedKey, getFingerAccuracy, getProgressPercent } from "./trainerSelectors";
import { initialTrainerState, trainerReducer } from "./trainerReducer";

export function TrainerPage() {
  const lessons = getLessons();
  const persisted = loadProgress();
  const [language, setLanguage] = useState<Language>(() => loadLanguage());
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
  }, [selectedLesson, state, unlockedLevel]);

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

  function startLesson(lessonId: string) {
    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return;
    }
    completedSavedRef.current = null;
    dispatch({
      type: "START_LESSON",
      lessonId: lesson.id,
      stream: fromContentToStream(lesson.content),
      startedAt: Date.now(),
      language
    });
  }

  function goToNextLesson() {
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
      <header className="top-bar">
        <h1>{text.appTitle}</h1>
        <div className="lesson-controls">
          <label htmlFor="lesson">{text.lesson}</label>
          <select
            id="lesson"
            value={selectedLesson.id}
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
            {state.phase === "running" ? text.restart : text.start}
          </button>
        </div>
      </header>

      <ProgressBar progressPercent={progressPercent} />
      <FeedbackBanner
        type={state.lastFeedback?.type}
        message={state.lastFeedback?.message ?? text.pressStart}
      />

      {currentResult ? (
        <SessionSummary
          language={language}
          result={currentResult}
          onRestart={() => startLesson(selectedLesson.id)}
          onNext={goToNextLesson}
          hasNext={selectedLesson.level < unlockedLevel}
        />
      ) : (
        <>
          <section className="focus-panel">
            <FocusCharacter value={expectedKey} />
            <p className="metric">
              {text.fingerAccuracy}: {fingerAccuracy.toFixed(1)}%
            </p>
          </section>
          <ContextText stream={state.stream} cursor={state.cursor} />
          <HandDiagram activeFinger={expectedFinger} />
          <KeyboardView expectedKey={expectedKey} />
        </>
      )}

      <footer className="trainer-footer">
        <p>
          {text.unlockedLevel}: {unlockedLevel}
        </p>
        <p>
          {text.completedSessions}: {history.length}
        </p>
      </footer>
    </main>
  );
}
