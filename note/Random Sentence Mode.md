# Random Sentence Mode (3 Difficulty) - Detailed Spec

## Goal
Add a new training mode that serves a random paragraph from a predefined set, with 3 difficulty levels:
- `easy`
- `medium`
- `hard`

The mode must keep the current product principle:
- strict correctness (no skipping)
- finger-first training
- low complexity implementation

---

## 1. Product Behavior

### 1.1 Mode Name
- Internal mode id: `random_sentence`
- UI label: `Random Sentence`

### 1.2 Difficulty Levels
- `easy`: short and simple sentences, common words, minimal punctuation.
- `medium`: moderate length, mixed word patterns, light punctuation.
- `hard`: longer sentences, more complex patterns, numbers/symbols/punctuation.

### 1.3 Session Start Flow
1. User selects `Random Sentence` mode.
2. User selects difficulty (`easy | medium | hard`).
3. System randomly picks 1 paragraph from that difficulty pool.
4. Existing strict typing engine runs on selected paragraph.

### 1.4 Randomization Rule
- Use uniform random from sentence pool.
- Avoid immediate repetition:
  - do not serve the same paragraph as the previous one when pool size > 1.

---

## 2. Data Design

## 2.1 New Types
```ts
export type SentenceDifficulty = "easy" | "medium" | "hard";

export interface SentenceSet {
  difficulty: SentenceDifficulty;
  items: string[];
}
```

## 2.2 Suggested New Source File
- `src/core/sentences.ts`

Example shape:
```ts
import { SentenceDifficulty } from "./types";

export const sentencePools: Record<SentenceDifficulty, string[]> = {
  easy: [
    "keep your hands on the home row and move each finger with control. type each key with the correct finger and keep a steady rhythm. slow and correct is better than fast and wrong."
  ],
  medium: [
    "practice every day and your fingers will remember the path of each key. maintain smooth movement and avoid over-pressing keys. steady rhythm with clean accuracy improves your control over longer typing blocks."
  ],
  hard: [
    "build reliable typing habits by balancing precision, rhythm, and consistency across longer passages. correct form under pressure matters more than temporary speed spikes, especially when punctuation, numbers 12345, and symbols !@#$% appear in mixed sequences. keep your posture stable and recover immediately after each error."
  ]
};
```

---

## 3. Mode Engine Changes

## 3.1 Extend Mode Type
- File: `src/core/modes.ts`
- Add: `random_sentence` to `TrainerMode`.

```ts
export type TrainerMode =
  | "learning"
  | "daily_routine"
  | "daily_focus"
  | "random_sentence";
```

## 3.2 Build Mode Session Contract
Add new optional input:
```ts
buildModeSession({
  mode,
  lesson,
  lastWeakFinger,
  sentenceDifficulty,
  lastSentence
})
```

New branch behavior:
- if `mode === "random_sentence"`:
  - read pool by `sentenceDifficulty`
  - pick random paragraph with no-immediate-repeat rule
  - return:
    - `id: "random-sentence-" + sentenceDifficulty`
    - `content: selectedParagraph`

---

## 4. UI and State Changes

## 4.1 New UI Controls
- Add difficulty select in `TrainerPage` visible only when `mode === "random_sentence"`.
- Values:
  - `easy`
  - `medium`
  - `hard`

## 4.2 Persistence
- Store selected random sentence difficulty.
- Suggested storage key:
  - `tft_sentence_difficulty_v1`

### Storage helpers
- `loadSentenceDifficulty(): SentenceDifficulty`
- `saveSentenceDifficulty(difficulty: SentenceDifficulty): void`

## 4.3 Last Paragraph Memory (Optional but recommended)
- Keep last chosen paragraph in component state.
- Used only to avoid immediate repetition.

---

## 5. UX Rules

1. Lesson dropdown is disabled in non-learning modes (already true).
2. Difficulty dropdown is enabled only in `random_sentence` mode.
3. On restart within `random_sentence`:
   - generate a new random paragraph
   - try not to repeat last paragraph

---

## 6. Testing Plan

## 6.1 Unit Tests
- `modes.ts`:
  - returns only easy pool paragraphs for `easy`
  - returns only medium pool paragraphs for `medium`
  - returns only hard pool paragraphs for `hard`
  - avoids immediate repeat when pool length > 1

## 6.2 Integration Tests
- `TrainerPage`:
  - selecting `random_sentence` shows difficulty selector
  - start launches paragraph from selected difficulty pool
  - refresh restores selected difficulty from storage

---

## 7. Acceptance Criteria

1. New mode `Random Sentence` is selectable.
2. User can choose one of 3 difficulties.
3. Paragraph content is randomly selected from the chosen difficulty set.
4. Typing flow remains strict (wrong key blocks progression).
5. Selected difficulty persists after page reload.
6. Core unit and integration tests pass.

---

## 8. Implementation Checklist

1. Add `SentenceDifficulty` type.
2. Create `src/core/sentences.ts` with easy/medium/hard pools.
3. Extend `TrainerMode` and `buildModeSession`.
4. Add difficulty selector in `TrainerPage`.
5. Add storage helpers for difficulty persistence.
6. Add tests for mode generation and UI behavior.
7. Update i18n labels for new mode and difficulty names.
