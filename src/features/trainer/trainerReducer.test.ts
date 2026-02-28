import { describe, expect, it } from "vitest";
import { initialTrainerState, trainerReducer } from "./trainerReducer";

describe("trainerReducer", () => {
  it("advances on correct key", () => {
    const started = trainerReducer(initialTrainerState, {
      type: "START_LESSON",
      lessonId: "l1",
      stream: ["a", "s"],
      startedAt: 100,
      language: "en"
    });

    const next = trainerReducer(started, {
      type: "HANDLE_KEY",
      actualKey: "a",
      ts: 200,
      language: "en"
    });

    expect(next.cursor).toBe(1);
    expect(next.phase).toBe("running");
    expect(next.keystrokes).toHaveLength(1);
    expect(next.keystrokes[0].correct).toBe(true);
  });

  it("blocks on wrong key", () => {
    const started = trainerReducer(initialTrainerState, {
      type: "START_LESSON",
      lessonId: "l1",
      stream: ["a"],
      startedAt: 100,
      language: "en"
    });

    const next = trainerReducer(started, {
      type: "HANDLE_KEY",
      actualKey: "x",
      ts: 200,
      language: "en"
    });

    expect(next.cursor).toBe(0);
    expect(next.phase).toBe("running");
    expect(next.lastFeedback?.message).toContain("Wrong key");
  });

  it("allows backspace only when cursor > 0", () => {
    const started = trainerReducer(initialTrainerState, {
      type: "START_LESSON",
      lessonId: "l1",
      stream: ["a", "s"],
      startedAt: 100,
      language: "en"
    });
    const advanced = trainerReducer(started, {
      type: "HANDLE_KEY",
      actualKey: "a",
      ts: 200,
      language: "en"
    });
    const rolledBack = trainerReducer(advanced, { type: "BACKSPACE", language: "en" });
    const blocked = trainerReducer(started, { type: "BACKSPACE", language: "en" });

    expect(rolledBack.cursor).toBe(0);
    expect(blocked.cursor).toBe(0);
  });

  it("sets unsupported key feedback", () => {
    const started = trainerReducer(initialTrainerState, {
      type: "START_LESSON",
      lessonId: "l1",
      stream: ["a"],
      startedAt: 100,
      language: "en"
    });
    const next = trainerReducer(started, { type: "UNSUPPORTED_KEY", key: "Enter", language: "en" });
    expect(next.lastFeedback?.message).toContain("Unsupported key");
    expect(next.cursor).toBe(0);
  });
});
