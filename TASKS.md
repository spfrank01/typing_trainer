# Typing Finger Habit Trainer - Implementation Tasks (MVP v2)

## 1. Project Setup
- [x] Initialize app with React + TypeScript + Vite.
- [x] Add base CSS variables and global reset.
- [x] Create folder structure from `TECH_SPEC.md`.
- [x] Add lint/format scripts.

## 2. Core Types and Static Data
- [x] Create `src/core/types.ts` with `Finger`, `Lesson`, `KeystrokeLog`, `SessionResult`.
- [x] Create `src/core/layoutMap.ts` for QWERTY key-to-finger mapping.
- [x] Create `src/core/lessons.ts` with Level 1-5 lesson definitions.
- [x] Add key normalization helper (`space`, lowercase symbols handling).

## 3. Trainer State and Reducer
- [x] Create `trainerReducer.ts` with `TrainerState` and actions.
- [x] Implement `START_LESSON`.
- [x] Implement key handling action (`HANDLE_KEY`, equivalent to `KEY_PRESSED`).
- [x] Implement `BACKSPACE`.
- [x] Implement completion transition (`phase = completed`, equivalent to `SESSION_COMPLETE`).
- [x] Integrate retry behavior via repetition engine trigger (equivalent to `RETRY_WEAK_KEYS`).
- [x] Implement strict progression rule (block on wrong key).
- [x] Implement cursor advancement on correct key only.
- [x] Implement backspace rule (only last-char correction).

## 4. Input Engine
- [x] Add global `keydown` listener in `TrainerPage`.
- [x] Ignore modifier keys (`Shift`, `Ctrl`, `Alt`, `Meta`).
- [x] Route normalized keys into reducer.
- [x] Add unsupported-key feedback path.

## 5. Scoring and Reinforcement Logic
- [x] Create `scoring.ts`.
- [x] Implement `calculateFingerAccuracy`.
- [x] Implement `getProblematicFinger`.
- [x] Create `reinforcement.ts` for mistake weighting.
- [x] Reinsert weak keys/chunks every fixed interval (12 chars).
- [x] Unit test reinforcement insertion behavior.

## 6. UI Components (MVP)
- [x] `ProgressBar.tsx` (top progress only).
- [x] `FocusCharacter.tsx` (large active character).
- [x] `ContextText.tsx` (dimmed full text + cursor highlight).
- [x] `HandDiagram.tsx` (highlight expected finger).
- [x] `KeyboardView.tsx` (color by finger + active key).
- [x] `FeedbackBanner.tsx` (correct/wrong/use finger message).
- [x] `SessionSummary.tsx` (total chars, finger accuracy, recommendation).

## 7. Page Integration
- [x] Build `TrainerPage.tsx` to compose all components.
- [x] Add lesson start/restart flow.
- [x] Add level unlock flow after completion.
- [x] Switch from training view to summary view on completion.

## 8. Persistence
- [x] Create `storage.ts` with `loadProgress`, `saveProgress`, `appendHistory`.
- [x] Persist `unlockedLevel` and `lastLessonId`.
- [x] Persist session summary history entries.
- [x] Restore progress on app load.

## 9. Acceptance Criteria Validation
- [x] Complete full Level 1 lesson end-to-end (validated by integration test).
- [x] Confirm wrong key blocks progression (validated by reducer/integration tests).
- [x] Confirm expected finger is highlighted every step (validated by integration flow).
- [x] Confirm summary shows finger accuracy (validated by integration test).
- [x] Confirm refresh keeps progress (validated by localStorage integration test).

## 10. Testing
- [x] Unit: key normalization.
- [x] Unit: advancement and blocking rules.
- [x] Unit: backspace constraint.
- [x] Unit: finger accuracy computation.
- [x] Unit: problematic finger selection.
- [x] Integration: Level 1 complete flow.
- [x] Integration: localStorage restore behavior.

## 11. Polish (Only if MVP Complete)
- [x] Tune keyboard/hand highlight timing for clarity.
- [x] Improve recommendation text quality.
- [x] Add small accessibility pass (contrast and focus states).
- [x] Add multi-language (i18n) support.

## 12. Completed Verification
- [x] `npm install` completed.
- [x] `npm run test:run` succeeded (14 tests passed).
- [x] `npm run build` succeeded and generated `dist`.

## 13. Suggested Build Sequence (Fast Path)
1. Setup + types + layout map.
2. Reducer + key handling.
3. Minimal UI (focus char + feedback + progress).
4. Hand/keyboard highlight.
5. Summary + persistence.
6. Reinforcement engine.
7. Tests and QA.

## 14. UI Review Tasks (Modern UX Pass)
- [x] Strengthen visual hierarchy with dominant typing focus area.
- [x] Split layout into clear sections: header, control bar, focus area, hands+keyboard, footer bar.
- [x] Apply consistent spacing system (8/16/24/32 scale).
- [x] Improve typography scale and character prominence.
- [x] Restyle controls and primary action button with hover/active states.
- [x] Redesign finger section to card layout (non-input appearance).
- [x] Add keyboard legend for finger-color mapping.
- [x] Improve keyboard visual depth and enlarge space key.
- [x] Add in-focus feedback animation (correct flash, wrong shake).
- [x] Convert footer stats to compact status chips including streak.
- [x] Improve accessibility cues (focus-visible, non-color active states).
- [x] Add responsive adjustments for narrower screens.
