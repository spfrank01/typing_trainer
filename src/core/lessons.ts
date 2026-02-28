import { Lesson } from "./types";

const lessons: Lesson[] = [
  {
    id: "level-1-home-row",
    level: 1,
    label: "Level 1 - Home Row",
    content: "asdf jkl; asdf jkl; sadf ;lkj asdf jkl;"
  },
  {
    id: "level-2-top-row",
    level: 2,
    label: "Level 2 - Add QWER UIOP",
    content: "qwer uiop asdf jkl; qwer asdf uiop jkl;"
  },
  {
    id: "level-3-full-alphabet",
    level: 3,
    label: "Level 3 - Full Alphabet",
    content: "the quick brown fox jumps over lazy dogs"
  },
  {
    id: "level-4-words",
    level: 4,
    label: "Level 4 - Words",
    content: "fast hand calm focus repeat press correct finger"
  },
  {
    id: "level-5-sentences",
    level: 5,
    label: "Level 5 - Sentences",
    content: "Type each letter with the correct finger and build strong habit."
  }
];

export function getLessons(): Lesson[] {
  return lessons;
}

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}
