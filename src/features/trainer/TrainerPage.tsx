import { useMemo, useReducer, useState } from "react";
import { ContextText } from "../../components/ContextText";
import { FocusCharacter } from "../../components/FocusCharacter";
import { HandDiagram } from "../../components/HandDiagram";
import { KeyboardView } from "../../components/KeyboardView";
import { ProgressBar } from "../../components/ProgressBar";
import { SessionSummary } from "../../components/SessionSummary";
import { getLessonById, getLessons } from "../../core/lessons";
import {
  copy,
  getLessonLabel,
  getModeLabel,
  getSentenceDifficultyFieldLabel,
  getSentenceDifficultyLabel,
  languageOptions,
  Language
} from "../../core/i18n";
import { getFingerForKey } from "../../core/layoutMap";
import { fromContentToStream } from "../../core/keyUtils";
import { buildModeSession, TrainerMode } from "../../core/modes";
import {
  loadHistory,
  loadLanguage,
  loadMode,
  loadProgress,
  loadSentenceDifficulty,
  saveLanguage,
  saveMode,
  saveSentenceDifficulty
} from "../../core/storage";
import { SentenceDifficulty, SessionResult } from "../../core/types";
import { getExpectedKey, getFingerAccuracy, getProgressPercent } from "./trainerSelectors";
import { initialTrainerState, trainerReducer } from "./trainerReducer";
import { useTrainerKeyboardInput } from "./useTrainerKeyboardInput";
import { useTrainerCompletion } from "./useTrainerCompletion";

export function TrainerPage() {
  const lessons = getLessons();
  const [initialProgress] = useState(() => loadProgress());
  const [language, setLanguage] = useState<Language>(() => loadLanguage());
  const [mode, setMode] = useState<TrainerMode>(() => loadMode());
  const [sentenceDifficulty, setSentenceDifficulty] = useState<SentenceDifficulty>(() =>
    loadSentenceDifficulty()
  );
  const [lastRandomSentence, setLastRandomSentence] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(initialProgress.lastLessonId);
  const [unlockedLevel, setUnlockedLevel] = useState<number>(initialProgress.unlockedLevel);
  const [history, setHistory] = useState<SessionResult[]>(() => loadHistory());
  const [state, dispatch] = useReducer(trainerReducer, initialTrainerState);

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
  useTrainerKeyboardInput({ phase: state.phase, language, dispatch });
  const { currentResult, resetCompletionGuard } = useTrainerCompletion({
    state,
    mode,
    selectedLesson,
    unlockedLevel,
    setUnlockedLevel,
    setHistory
  });

  const availableLessons = lessons.filter((lesson) => lesson.level <= unlockedLevel);
  const sentenceDifficultyLabel = getSentenceDifficultyFieldLabel(language);
  const lastWeakFinger = history.length > 0 ? history[history.length - 1].problematicFinger : null;
  const isRunning = state.phase === "running";

  function startLesson(lessonId: string) {
    const lesson = getLessonById(lessonId);
    if (!lesson) {
      return;
    }
    resetCompletionGuard();
    const session = buildModeSession({
      mode,
      lesson,
      lastWeakFinger,
      sentenceDifficulty,
      lastSentence: lastRandomSentence
    });
    if (mode === "random_sentence") {
      setLastRandomSentence(session.content);
    }
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
        <div className="lang-control">
          <select
            id="language"
            className="lang-select"
            aria-label={text.language}
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
        </div>
      </header>

      <section className="control-bar">
        <div className="lesson-controls">
          <div className="control-fields">
            <div className="control-field">
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
                <option value="learning">{getModeLabel(language, "learning")}</option>
                <option value="daily_routine">{getModeLabel(language, "daily_routine")}</option>
                <option value="daily_focus">{getModeLabel(language, "daily_focus")}</option>
                <option value="random_sentence">{getModeLabel(language, "random_sentence")}</option>
              </select>
            </div>
            {mode === "random_sentence" ? (
              <div className="control-field">
                <label htmlFor="sentence-difficulty">{sentenceDifficultyLabel}</label>
                <select
                  id="sentence-difficulty"
                  value={sentenceDifficulty}
                  onChange={(event) => {
                    const nextDifficulty = event.target.value as SentenceDifficulty;
                    setSentenceDifficulty(nextDifficulty);
                    saveSentenceDifficulty(nextDifficulty);
                  }}
                >
                  <option value="easy">{getSentenceDifficultyLabel(language, "easy")}</option>
                  <option value="medium">{getSentenceDifficultyLabel(language, "medium")}</option>
                  <option value="hard">{getSentenceDifficultyLabel(language, "hard")}</option>
                </select>
              </div>
            ) : null}
            <div className="control-field">
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
            </div>
          </div>
          <div className="control-actions">
            <button
              type="button"
              className={isRunning ? "btn-ghost" : "btn-primary"}
              onClick={() => startLesson(selectedLesson.id)}
            >
              {isRunning ? text.restart : text.start}
            </button>
          </div>
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
            <HandDiagram
              activeFinger={expectedFinger}
              language={language}
              status={state.lastFeedback?.type}
            />
            <KeyboardView
              expectedKey={expectedKey}
              language={language}
              status={state.lastFeedback?.type}
            />
          </section>
        </>
      )}

      <footer className="status-bar">
        <p className="status-item">
          {text.unlockedLevel}: {unlockedLevel}
        </p>
        <p className="status-item">
          {text.completedSessions}: {history.length}
        </p>
        <p className="status-item">
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
