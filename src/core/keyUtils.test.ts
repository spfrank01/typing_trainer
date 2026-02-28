import { describe, expect, it } from "vitest";
import { fromContentToStream, normalizeKey } from "./keyUtils";

describe("keyUtils", () => {
  it("normalizes space and letters", () => {
    expect(normalizeKey(" ")).toBe("space");
    expect(normalizeKey("A")).toBe("a");
    expect(normalizeKey(";")).toBe(";");
  });

  it("keeps named keys unchanged", () => {
    expect(normalizeKey("Enter")).toBe("Enter");
    expect(normalizeKey("Backspace")).toBe("Backspace");
  });

  it("converts lesson content into key stream", () => {
    expect(fromContentToStream("A b;")).toEqual(["a", "space", "b", ";"]);
  });
});
