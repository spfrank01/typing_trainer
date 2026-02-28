import { describe, expect, it } from "vitest";
import { createRepetitionDrill } from "./reinforcement";

describe("reinforcement", () => {
  it("returns empty drill when no mistakes", () => {
    expect(createRepetitionDrill({})).toEqual([]);
  });

  it("builds weighted drill from top weak keys", () => {
    const drill = createRepetitionDrill({ a: 4, s: 2, d: 1 }, 2, 2);
    expect(drill).toEqual(["a", "a", "s", "s"]);
  });
});
