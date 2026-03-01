# Typing Finger Habit Trainer - Technical Specification (MVP v2)

## 1. Scope
This spec implements the simplified MVP in [REQUIREMENTS.md](C:\Users\Frank\Desktop\Playground\typing_trainer\REQUIREMENTS.md):
- Desktop-only typing trainer.
- Single strict step-by-step mode.
- Finger habit reinforcement over speed metrics.
- Client-side only with `localStorage` persistence.

## 2. Tech Stack (MVP)
- Framework: React + TypeScript + Vite.
- Styling: plain CSS with CSS variables.
- State: React state + reducer (no external state library).
- Persistence: `localStorage`.
- Charts/analytics libs: none (intentionally removed).

## 3. App Architecture
## 3.1 High-Level Modules
- `lesson-engine`: lesson content and progression logic.
- `input-engine`: keyboard event handling and validation.
- `reinforcement-engine`: repeats weak keys/chunks.
- `ui`: focus character, hand diagram, keyboard, progress, summary.
- `storage`: read/write progress and session history.

## 3.2 Directory Layout
```txt
src/
  app/
    App.tsx
    routes.ts (optional, can be single page in MVP)
  core/
    layoutMap.ts
    lessons.ts
    types.ts
    scoring.ts
    reinforcement.ts
    storage.ts
  features/trainer/
    TrainerPage.tsx
    trainerReducer.ts
    trainerSelectors.ts
  components/
    FocusCharacter.tsx
    ContextText.tsx
    HandDiagram.tsx
    KeyboardView.tsx
    ProgressBar.tsx
    FeedbackBanner.tsx
    SessionSummary.tsx
```

## 4. Domain Model
```ts
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

export interface LayoutMapEntry {
  key: string;       // normalized key id, example: "a", ";", "space"
  finger: Finger;
}

export interface Lesson {
  id: string;        // example: "level-1-home-row"
  level: number;     // 1..5
  label: string;
  characters: string[];
}

export interface KeystrokeLog {
  ts: number;        // epoch ms
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
```

## 5. Key Mapping Strategy
Browser cannot detect physical finger usage, so MVP uses deterministic key-to-finger mapping.

## 5.1 Mapping Rules
- Default layout: US QWERTY.
- Key normalization:
- lower-case letters.
- `event.key === " "` maps to `"space"`.
- keep symbols as-is where possible (`;`, `,`, `.`, `/`).

## 5.2 Mapping Source
- `layoutMap.ts` exports `Record<string, Finger>`.
- Unknown key handling:
- ignore key for progression.
- show lightweight feedback `Unsupported key`.

## 6. Lesson Engine
## 6.1 Lesson Sequence
1. Level 1: `asdf jkl;`
2. Level 2: add `qwer uiop`
3. Level 3: full alphabet
4. Level 4: words
5. Level 5: sentences

## 6.2 Exercise Stream
- Build a stream of expected characters from lesson content.
- Cursor points to current expected character.
- Advance only on correct key.

## 7. Input/Validation Engine
## 7.1 Keyboard Handling
- Listen on `window` `keydown`.
- Prevent default for keys used by trainer to keep focus stable.

## 7.2 Validation Flow
1. Normalize incoming key.
2. Read expected key from current cursor.
3. If key is `Backspace`:
- allow only when correcting last typed char (single-step rollback).
4. If `actualKey === expectedKey`:
- mark correct.
- advance cursor.
5. Else:
- mark incorrect.
- block advance.
- trigger feedback `Use <expected finger>`.

## 7.3 Strict Progression Rule
- No skipping ahead.
- No auto-advance on partial match.
- Every character must be solved before next one is shown as active.

## 8. Repetition Engine
## 8.1 Goal
Increase repetition for weak characters during the same session.

## 8.2 Simple Algorithm (MVP)
- Maintain `mistakeCountByKey`.
- On each wrong press for expected key `k`, increment count.
- At chunk boundary (for example every 12 chars), reinsert weak keys:
- choose top 2-3 keys by mistake count.
- append short drill pattern (example: `"k k k"` or key-specific mini-sequence).

This keeps implementation simple while enforcing repetition.

## 9. State Management
## 9.1 Trainer State
```ts
interface TrainerState {
  phase: "idle" | "running" | "completed";
  lessonId: string;
  stream: string[];
  cursor: number;
  lastFeedback: null | {
    type: "correct" | "wrong" | "warning";
    message: string;
  };
  keystrokes: KeystrokeLog[];
  mistakeCountByKey: Record<string, number>;
  startedAt: number | null;
  endedAt: number | null;
}
```

## 9.2 Derived Selectors
- `progressPercent = cursor / stream.length * 100`
- `fingerAccuracy = correctChars / totalChars * 100`
- `expectedKey = stream[cursor]`
- `expectedFinger = layoutMap[expectedKey]`

## 10. UI Component Spec
## 10.1 `TrainerPage`
- Container for lesson selection, active training view, and summary.

## 10.2 `FocusCharacter`
- Shows current expected character in large size.
- Strong visual priority.

## 10.3 `ContextText`
- Shows full string dimmed.
- Current cursor position highlighted.

## 10.4 `HandDiagram`
- Static hand illustration.
- Highlight expected finger only.

## 10.5 `KeyboardView`
- Visual keyboard.
- Color groups per finger.
- Active expected key highlight.

## 10.6 `FeedbackBanner`
- Short status messages:
- `Correct`
- `Wrong key`
- `Use Left Ring`

## 10.7 `ProgressBar`
- Top fixed progress bar for lesson completion.

## 10.8 `SessionSummary`
- total characters
- finger accuracy
- most problematic finger
- recommendation text

## 11. Persistence
## 11.1 Storage Keys
- `tft_progress_v1`
- `tft_history_v1`

## 11.2 Persisted Data
```ts
interface PersistedProgress {
  unlockedLevel: number;
  lastLessonId: string;
}

interface PersistedHistoryEntry extends SessionResult {}
```

## 11.3 Write Points
- On session complete: write progress + append history.
- On lesson unlock: update unlocked level.

## 12. Error Handling and Edge Cases
- Ignore modifier-only keys (`Shift`, `Ctrl`, `Alt`, `Meta`).
- Ignore IME composition events in MVP (document limitation).
- If focus is lost, keep state and continue when focus returns.
- If mapping missing for expected key, fail safe:
- show warning.
- skip only that unsupported character during content build.

## 13. Accessibility (MVP Baseline)
- All controls keyboard reachable.
- Feedback text always shown (not color-only).
- Minimum contrast 4.5:1 for critical text.

## 14. Performance Targets
- Key processing path under ~50ms on modern desktop browser.
- No heavy rendering on each key press; memoize static diagrams.

## 15. Testing Plan
## 15.1 Unit Tests
- key normalization.
- advancement rules.
- backspace rule.
- finger accuracy calculation.
- repetition insertion logic.

## 15.2 Integration Tests
- complete Level 1 flow.
- wrong key blocks progression.
- summary values render correctly.
- localStorage restore after reload.

## 16. Delivery Milestones
1. Core engine + Level 1 lesson playable.
2. Hand + keyboard highlight UI.
3. Session summary + persistence.
4. Repetition engine + level unlock flow.
5. Final QA and bug fixes.

## 17. Explicitly Not in MVP
- WPM computation/display.
- Multiplayer.
- Custom text input.
- Heatmaps and advanced analytics.
