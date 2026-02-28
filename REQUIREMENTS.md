# Typing Finger Habit Trainer - Simplified Requirements (MVP v2)

## 1. Purpose
Help slow typists who mainly use index fingers build correct touch-typing finger habits.
The product focus is automatic muscle memory through repetition, not speed.

## 2. Target Users
- Slow typists (<30 WPM).
- Users typing with 1-2 fingers.
- Users who care about "correct finger usage" more than WPM.

## 3. Core Principle
`No skipping.`
User must press the correct key for the current step before moving forward.
Accuracy comes before speed.

## 4. Simplified Core Features (MVP)
### 4.1 Step-by-Step Typing Mode (Primary)
- Show text one character at a time in focus mode.
- Highlight the target key.
- Highlight the finger that should be used.
- If correct key is pressed: advance to next character.
- If wrong key is pressed: block progress and show correction feedback.
- Only one mode in MVP (no speed mode, no multi-mode).

### 4.2 Strict Finger Training Logic
Browser cannot directly detect which physical finger was used.
MVP behavior:
- System provides key-to-finger mapping.
- UI always shows "expected finger" for the current key.
- On mistakes, show finger reminder (example: `Use Left Ring`).
- Enforce retry until correct key is entered.

### 4.3 Slow Mode by Default
- No countdown timer.
- No live WPM during typing.
- Show only:
- Progress (%).
- Finger accuracy (%).

### 4.4 Beginner Lesson Structure
- Level 1: Home row only (`asdf jkl;`).
- Level 2: Add top-row basics (`qwer uiop`).
- Level 3: Full alphabet.
- Level 4: Words.
- Level 5: Sentences.

## 5. Functional Requirements
### 5.1 Keystroke Handling
- Listen to `keydown` events.
- Compare `expectedKey` vs `actualKey`.
- Read `expectedFinger` from the layout mapping.

### 5.2 Advancement Rule
| Case | Result |
| --- | --- |
| correct key | advance |
| wrong key | block + feedback |
| backspace | allowed only to correct last character |

### 5.3 Finger Reinforcement UI
- Show both hands as a simple visual diagram.
- Highlight required finger each step.
- Color-code keyboard keys by finger group.

### 5.4 Repetition Engine
- If a character is repeatedly mistyped, increase its practice weight in the same session.
- Reinsert weak characters/words for extra repetition.

### 5.5 Session Completion
Show:
- Total characters.
- Finger accuracy (%).
- Most problematic finger.
- Recommendation text (example: `Practice Left Ring more`).

Do not show WPM in MVP.

## 6. Non-Functional Requirements
- Desktop-first.
- Physical keyboard use only.
- Mobile responsive support is not required in MVP.
- Client-side only (no backend).
- Persist progress in `localStorage`.

## 7. UI Simplification
### Main Screen
- One large current character (focus mode).
- Full word/sentence shown dimmed in background/context line.
- Two-hand diagram in the center area.
- On-screen keyboard at the bottom.
- Progress bar at top.

### Explicitly Removed from Main UI
- Heatmaps.
- Charts/graphs.
- Complex metric panels.

## 8. Data Model (Simplified)
```ts
type Finger =
  | "L_PINKY"
  | "L_RING"
  | "L_MIDDLE"
  | "L_INDEX"
  | "R_INDEX"
  | "R_MIDDLE"
  | "R_RING"
  | "R_PINKY"
  | "THUMB";

interface LayoutMapEntry {
  key: string;
  finger: Finger;
}

interface Lesson {
  id: string;
  characters: string[];
}

interface KeystrokeLog {
  expectedKey: string;
  actualKey: string;
  expectedFinger: Finger;
  correct: boolean;
}

interface SessionResult {
  totalChars: number;
  correctChars: number;
  fingerErrors: number;
}
```

## 9. Acceptance Criteria (Revised)
1. User can complete a full home-row lesson.
2. System blocks progression on wrong key press.
3. Correct finger hint is highlighted on every step.
4. Session end screen shows finger accuracy.
5. Progress persists after page refresh.

## 10. Deliberately Removed from MVP
- WPM ranking.
- Multiplayer.
- Custom text mode.
- Heatmap analytics.
- Advanced performance analytics.

## 11. Product Strategy
Primary goal:
`Change typing habit first, measure speed later.`

WPM and speed gamification are Phase 2.
Current phase is strict finger memory training.

## 12. Build Complexity (After Adjustment)
| Area | Before | After |
| --- | --- | --- |
| Logic | complex | simple |
| UI | heavy | focused |
| Metrics | many | minimal |
| Dev time | 4-6 weeks | 1-2 weeks |
