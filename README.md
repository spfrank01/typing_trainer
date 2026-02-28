# Typing Finger Habit Trainer

A desktop-first web app to train correct finger habits for touch typing.
This MVP focuses on muscle memory and accuracy, not speed.

## Live Demo
- https://spfrank01.github.io/typing_tranier/

## MVP Focus
- Step-by-step typing (one strict flow).
- Wrong key blocks progress.
- Expected key and expected finger are highlighted every step.
- Repetition for weak keys inside the same session.
- Session summary shows finger accuracy and problematic finger.
- Progress is saved in `localStorage`.
- Language switcher (English/Thai) in the top-right with persisted preference.
- Modernized UI with dominant focus area, compact controls, keyboard legend, and feedback animations.

## Training Modes
1. Learning
- Uses level-based lessons (Level 1-5).

2. Daily Routine
- Fixed daily sequence based on `note/Daily Finger Routine Mode.md`.
- Warm-up, top row, bottom row, alphabet flow, numbers/shift, then weak-finger reinforcement.

3. Daily Focus
- Short focused routine with extra repetition for the latest weak finger.

## Tech Stack
- React
- TypeScript
- Vite
- Plain CSS

## Requirements and Specs
- Product requirements: [REQUIREMENTS.md](C:\Users\Frank\Desktop\Playground\typing_traning\REQUIREMENTS.md)
- Technical spec: [TECH_SPEC.md](C:\Users\Frank\Desktop\Playground\typing_traning\TECH_SPEC.md)
- Task checklist: [TASKS.md](C:\Users\Frank\Desktop\Playground\typing_traning\TASKS.md)
- Progress tracking: [PROGRESS.md](C:\Users\Frank\Desktop\Playground\typing_traning\PROGRESS.md)

## Run Locally
```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Build
```bash
npm run build
npm run preview
```

## Project Structure
```txt
src/
  app/
  components/
  core/
  features/trainer/
  styles/
```

## Current Status
- Core MVP is implemented and build passes.
- Core backlog is complete, including tests, i18n, and UI modernization.

## Notes
- Node `18.14.0` works for build, but some ESLint packages warn they prefer `>=18.18.0`.

## Next Planned Work
1. Optional: add CI workflow for `test + build` checks on push.
2. Optional: replace text-based hand cards with SVG hand illustration.
