import { describe, expect, it, vi } from "vitest";
import { buildModeSession } from "./modes";
import { getLessonById } from "./lessons";
import { getSentencePool } from "./sentences";

describe("random_sentence mode", () => {
  const lesson = getLessonById("level-1-home-row");

  it("returns easy pool content when difficulty is easy", () => {
    expect(lesson).toBeDefined();
    const session = buildModeSession({
      mode: "random_sentence",
      lesson: lesson!,
      lastWeakFinger: null,
      sentenceDifficulty: "easy",
      lastSentence: null
    });
    expect(getSentencePool("easy")).toContain(session.content);
  });

  it("returns medium pool content when difficulty is medium", () => {
    expect(lesson).toBeDefined();
    const session = buildModeSession({
      mode: "random_sentence",
      lesson: lesson!,
      lastWeakFinger: null,
      sentenceDifficulty: "medium",
      lastSentence: null
    });
    expect(getSentencePool("medium")).toContain(session.content);
  });

  it("returns hard pool content when difficulty is hard", () => {
    expect(lesson).toBeDefined();
    const session = buildModeSession({
      mode: "random_sentence",
      lesson: lesson!,
      lastWeakFinger: null,
      sentenceDifficulty: "hard",
      lastSentence: null
    });
    expect(getSentencePool("hard")).toContain(session.content);
  });

  it("avoids immediate repeat when pool has multiple options", () => {
    expect(lesson).toBeDefined();
    const easyPool = getSentencePool("easy");
    const lastSentence = easyPool[0];

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    const session = buildModeSession({
      mode: "random_sentence",
      lesson: lesson!,
      lastWeakFinger: null,
      sentenceDifficulty: "easy",
      lastSentence
    });
    randomSpy.mockRestore();

    expect(session.content).not.toBe(lastSentence);
    expect(easyPool).toContain(session.content);
  });
});
