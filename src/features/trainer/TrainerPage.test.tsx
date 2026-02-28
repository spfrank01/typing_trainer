import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { getLessonById } from "../../core/lessons";
import { fromContentToStream } from "../../core/keyUtils";
import { TrainerPage } from "./TrainerPage";

describe("TrainerPage integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("completes Level 1 flow and shows session summary", async () => {
    render(<TrainerPage />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    const lesson = getLessonById("level-1-home-row");
    expect(lesson).toBeDefined();
    const stream = fromContentToStream(lesson!.content);

    stream.forEach((key) => {
      const eventKey = key === "space" ? " " : key;
      fireEvent.keyDown(window, { key: eventKey });
    });

    await waitFor(() => {
      expect(screen.getByText("Session Complete")).toBeInTheDocument();
    });
    expect(screen.getByText(/Finger accuracy:/)).toBeInTheDocument();
  });

  it("restores progress from localStorage", () => {
    localStorage.setItem(
      "tft_progress_v1",
      JSON.stringify({ unlockedLevel: 3, lastLessonId: "level-2-top-row" })
    );

    render(<TrainerPage />);

    expect(screen.getByText("Unlocked level: 3")).toBeInTheDocument();
    const lessonSelect = screen.getByLabelText("Lesson") as HTMLSelectElement;
    expect(lessonSelect.value).toBe("level-2-top-row");
  });

  it("shows unsupported-key feedback while running", () => {
    render(<TrainerPage />);
    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    fireEvent.keyDown(window, { key: "Enter" });
    expect(screen.getByText(/Unsupported key/)).toBeInTheDocument();
  });
});
