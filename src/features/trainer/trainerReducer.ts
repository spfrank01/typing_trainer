import { createRepetitionDrill } from "../../core/reinforcement";
import { getReducerMessage, Language } from "../../core/i18n";
import { formatFingerLabel, getFingerForKey } from "../../core/layoutMap";
import { KeystrokeLog } from "../../core/types";

type FeedbackType = "correct" | "wrong" | "warning" | "info";

export interface TrainerState {
  phase: "idle" | "running" | "completed";
  lessonId: string;
  stream: string[];
  cursor: number;
  lastFeedback: null | {
    type: FeedbackType;
    message: string;
  };
  keystrokes: KeystrokeLog[];
  totalKeystrokes: number;
  errorKeystrokes: number;
  mistakeCountByKey: Record<string, number>;
  startedAt: number | null;
  endedAt: number | null;
}

export type TrainerAction =
  | { type: "START_LESSON"; lessonId: string; stream: string[]; startedAt: number; language: Language }
  | { type: "HANDLE_KEY"; actualKey: string; ts: number; language: Language }
  | { type: "UNSUPPORTED_KEY"; key: string; language: Language }
  | { type: "BACKSPACE"; language: Language }
  | { type: "RESET_FEEDBACK" };

const repetitionInterval = 12;

export const initialTrainerState: TrainerState = {
  phase: "idle",
  lessonId: "",
  stream: [],
  cursor: 0,
  lastFeedback: null,
  keystrokes: [],
  totalKeystrokes: 0,
  errorKeystrokes: 0,
  mistakeCountByKey: {},
  startedAt: null,
  endedAt: null
};

export function trainerReducer(state: TrainerState, action: TrainerAction): TrainerState {
  switch (action.type) {
    case "START_LESSON":
      return {
        phase: "running",
        lessonId: action.lessonId,
        stream: action.stream,
        cursor: 0,
        lastFeedback: {
          type: "info",
          message: getReducerMessage(action.language, "lessonStarted")
        },
        keystrokes: [],
        totalKeystrokes: 0,
        errorKeystrokes: 0,
        mistakeCountByKey: {},
        startedAt: action.startedAt,
        endedAt: null
      };
    case "BACKSPACE":
      if (state.phase !== "running" || state.cursor <= 0) {
        return state;
      }
      return {
        ...state,
        cursor: state.cursor - 1,
        lastFeedback: {
          type: "warning",
          message: getReducerMessage(action.language, "backspace")
        }
      };
    case "UNSUPPORTED_KEY":
      if (state.phase !== "running") {
        return state;
      }
      return {
        ...state,
        lastFeedback: {
          type: "warning",
          message: getReducerMessage(action.language, "unsupported", { keyName: action.key })
        }
      };
    case "HANDLE_KEY": {
      if (state.phase !== "running") {
        return state;
      }

      const expectedKey = state.stream[state.cursor];
      if (!expectedKey) {
        return state;
      }

      const expectedFinger = getFingerForKey(expectedKey);
      const correct = action.actualKey === expectedKey;
      const keystroke: KeystrokeLog = {
        ts: action.ts,
        expectedKey,
        actualKey: action.actualKey,
        expectedFinger,
        correct
      };

      const nextKeystrokes = [...state.keystrokes, keystroke];
      const totalKeystrokes = state.totalKeystrokes + 1;

      if (correct) {
        const nextCursor = state.cursor + 1;
        const completed = nextCursor >= state.stream.length;
        return {
          ...state,
          phase: completed ? "completed" : "running",
          cursor: nextCursor,
          endedAt: completed ? action.ts : null,
          keystrokes: nextKeystrokes,
          totalKeystrokes,
          lastFeedback: {
            type: "correct",
            message: completed
              ? getReducerMessage(action.language, "completed")
              : getReducerMessage(action.language, "correct")
          }
        };
      }

      const nextMistakeCountByKey = {
        ...state.mistakeCountByKey,
        [expectedKey]: (state.mistakeCountByKey[expectedKey] ?? 0) + 1
      };

      let nextStream = state.stream;
      if (nextKeystrokes.length % repetitionInterval === 0) {
        const extra = createRepetitionDrill(nextMistakeCountByKey);
        if (extra.length > 0) {
          nextStream = [...state.stream, ...extra];
        }
      }

      return {
        ...state,
        stream: nextStream,
        keystrokes: nextKeystrokes,
        totalKeystrokes,
        errorKeystrokes: state.errorKeystrokes + 1,
        mistakeCountByKey: nextMistakeCountByKey,
        lastFeedback: {
          type: "wrong",
          message: getReducerMessage(action.language, "wrong", {
            fingerName: formatFingerLabel(expectedFinger, action.language)
          })
        }
      };
    }
    case "RESET_FEEDBACK":
      return {
        ...state,
        lastFeedback: null
      };
    default:
      return state;
  }
}
