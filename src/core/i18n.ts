import { Finger } from "./types";
import { SentenceDifficulty } from "./types";
import { TrainerMode } from "./modes";

export type Language = "en" | "th";

export const languageOptions: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "th", label: "ไทย" }
];

export const copy = {
  en: {
    appTitle: "Typing Finger Habit Trainer",
    lesson: "Lesson",
    mode: "Mode",
    language: "Language",
    start: "Start",
    restart: "Restart",
    fingerAccuracy: "Finger accuracy",
    unlockedLevel: "Unlocked level",
    completedSessions: "Completed sessions",
    streak: "Streak",
    dayUnit: "days",
    pressStart: "Press Start to begin.",
    sessionComplete: "Session Complete",
    totalCharacters: "Total characters",
    mostProblematicFinger: "Most problematic finger",
    none: "None",
    restartLesson: "Restart Lesson",
    nextLesson: "Next Lesson",
    modes: {
      learning: "Learning",
      daily_routine: "Daily Routine",
      daily_focus: "Daily Focus"
    },
    levelLabels: {
      "level-1-home-row": "Level 1 - Home Row",
      "level-2-top-row": "Level 2 - Add QWER UIOP",
      "level-3-full-alphabet": "Level 3 - Full Alphabet",
      "level-4-words": "Level 4 - Words",
      "level-5-sentences": "Level 5 - Sentences"
    }
  },
  th: {
    appTitle: "ฝึกนิ้วพิมพ์ให้ถูกตำแหน่ง",
    lesson: "บทเรียน",
    mode: "โหมด",
    language: "ภาษา",
    start: "เริ่ม",
    restart: "เริ่มใหม่",
    fingerAccuracy: "ความแม่นยำนิ้ว",
    unlockedLevel: "เลเวลที่ปลดล็อก",
    completedSessions: "จำนวนรอบที่จบ",
    streak: "สตรีค",
    dayUnit: "วัน",
    pressStart: "กดเริ่มเพื่อฝึก",
    sessionComplete: "จบบทเรียนแล้ว",
    totalCharacters: "จำนวนตัวอักษรทั้งหมด",
    mostProblematicFinger: "นิ้วที่พลาดบ่อยที่สุด",
    none: "ไม่มี",
    restartLesson: "ฝึกบทเรียนเดิม",
    nextLesson: "บทเรียนถัดไป",
    modes: {
      learning: "โหมดเรียนรู้",
      daily_routine: "รูทีนประจำวัน",
      daily_focus: "โฟกัสนิ้วอ่อน"
    },
    levelLabels: {
      "level-1-home-row": "เลเวล 1 - แถว Home Row",
      "level-2-top-row": "เลเวล 2 - เพิ่ม QWER UIOP",
      "level-3-full-alphabet": "เลเวล 3 - ตัวอักษรครบ",
      "level-4-words": "เลเวล 4 - คำศัพท์",
      "level-5-sentences": "เลเวล 5 - ประโยค"
    }
  }
} as const;

export function getLessonLabel(language: Language, lessonId: string, fallback: string): string {
  return copy[language].levelLabels[lessonId as keyof typeof copy.en.levelLabels] ?? fallback;
}

export function getReducerMessage(
  language: Language,
  key: "lessonStarted" | "backspace" | "unsupported" | "completed" | "correct" | "wrong",
  params?: { keyName?: string; fingerName?: string }
): string {
  if (language === "th") {
    switch (key) {
      case "lessonStarted":
        return "เริ่มบทเรียนแล้ว ให้กดตามนิ้วที่ไฮไลต์";
      case "backspace":
        return "ย้อนกลับ 1 ตัวอักษร";
      case "unsupported":
        return `ปุ่ม (${params?.keyName ?? ""}) ยังไม่รองรับ ให้กดปุ่มที่ไฮไลต์`;
      case "completed":
        return "จบบทเรียนแล้ว";
      case "correct":
        return "ถูกต้อง";
      case "wrong":
        return `กดผิด ควรใช้ ${params?.fingerName ?? ""}`;
      default:
        return "";
    }
  }

  switch (key) {
    case "lessonStarted":
      return "Lesson started. Follow the highlighted finger.";
    case "backspace":
      return "Moved back one character.";
    case "unsupported":
      return `Unsupported key (${params?.keyName ?? ""}). Press the highlighted key.`;
    case "completed":
      return "Lesson completed.";
    case "correct":
      return "Correct.";
    case "wrong":
      return `Wrong key. Use ${params?.fingerName ?? ""}.`;
    default:
      return "";
  }
}

export function recommendationByFinger(finger: Finger | null, language: Language): string {
  if (language === "th") {
    if (!finger) {
      return "ทำได้ดี ฝึกซ้ำต่อเนื่องเพื่อให้กล้ามเนื้อจำอัตโนมัติ";
    }
    const thAdvice: Record<Finger, string> = {
      L_PINKY: "ฝึกนิ้วก้อยซ้ายเพิ่ม โดยวน A/Q/Z และ ; ช้าๆ",
      L_RING: "ฝึกนิ้วนางซ้ายเพิ่ม โดยวน S/W/X ให้จังหวะคงที่",
      L_MIDDLE: "ฝึกนิ้วกลางซ้ายเพิ่ม โดยวน D/E/C ก่อนต่อคำ",
      L_INDEX: "ฝึกนิ้วชี้ซ้ายเพิ่ม โดยวน F/G/R/T/V/B เป็นช่วงสั้น",
      R_INDEX: "ฝึกนิ้วชี้ขวาเพิ่ม โดยวน J/H/Y/U/N/M เป็นช่วงสั้น",
      R_MIDDLE: "ฝึกนิ้วกลางขวาเพิ่ม โดยวน K/I/, ช้าๆ",
      R_RING: "ฝึกนิ้วนางขวาเพิ่ม โดยวน L/O/. ด้วยจังหวะคงที่",
      R_PINKY: "ฝึกนิ้วก้อยขวาเพิ่ม โดยวน ;/P// อย่างระวัง",
      THUMB: "ฝึกนิ้วโป้งเพิ่ม โดยคุมจังหวะเว้นวรรคให้สม่ำเสมอ"
    };
    return thAdvice[finger];
  }

  if (!finger) {
    return "Great session. Keep repeating the lesson to strengthen muscle memory.";
  }
  const enAdvice: Record<Finger, string> = {
    L_PINKY: "Practice Left Pinky more. Repeat A/Q/Z and semicolon drills slowly.",
    L_RING: "Practice Left Ring more. Repeat S/W/X with controlled rhythm.",
    L_MIDDLE: "Practice Left Middle more. Repeat D/E/C before moving to words.",
    L_INDEX: "Practice Left Index more. Repeat F/G/R/T/V/B with short bursts.",
    R_INDEX: "Practice Right Index more. Repeat J/H/Y/U/N/M with short bursts.",
    R_MIDDLE: "Practice Right Middle more. Repeat K/I/comma drills slowly.",
    R_RING: "Practice Right Ring more. Repeat L/O/period with steady timing.",
    R_PINKY: "Practice Right Pinky more. Repeat semicolon/P/slash carefully.",
    THUMB: "Practice Thumb more. Keep spacing rhythm steady between words."
  };
  return enAdvice[finger];
}

export function getTrainerUiCopy(language: Language): {
  handGuide: string;
  leftHand: string;
  rightHand: string;
  keyboardMap: string;
  keyboardLegendTitle: string;
} {
  if (language === "th") {
    return {
      handGuide: "คำแนะนำนิ้ว",
      leftHand: "มือซ้าย",
      rightHand: "มือขวา",
      keyboardMap: "ผังคีย์บอร์ด",
      keyboardLegendTitle: "สี = นิ้วที่แนะนำ"
    };
  }

  return {
    handGuide: "Finger guide",
    leftHand: "Left Hand",
    rightHand: "Right Hand",
    keyboardMap: "Keyboard map",
    keyboardLegendTitle: "Color = Assigned Finger"
  };
}

export function getModeLabel(language: Language, mode: TrainerMode): string {
  if (language === "th") {
    switch (mode) {
      case "learning":
        return "โหมดเรียนรู้";
      case "daily_routine":
        return "รูทีนประจำวัน";
      case "daily_focus":
        return "โฟกัสนิ้วอ่อน";
      case "random_sentence":
        return "สุ่มย่อหน้า";
      default:
        return mode;
    }
  }

  switch (mode) {
    case "learning":
      return "Learning";
    case "daily_routine":
      return "Daily Routine";
    case "daily_focus":
      return "Daily Focus";
    case "random_sentence":
      return "Random Sentence";
    default:
      return mode;
  }
}

export function getSentenceDifficultyLabel(
  language: Language,
  difficulty: SentenceDifficulty
): string {
  if (language === "th") {
    switch (difficulty) {
      case "easy":
        return "ง่าย";
      case "medium":
        return "ปานกลาง";
      case "hard":
        return "ยาก";
      default:
        return difficulty;
    }
  }

  switch (difficulty) {
    case "easy":
      return "Easy";
    case "medium":
      return "Medium";
    case "hard":
      return "Hard";
    default:
      return difficulty;
  }
}

export function getSentenceDifficultyFieldLabel(language: Language): string {
  return language === "th" ? "ความยาก" : "Difficulty";
}
