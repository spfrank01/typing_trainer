import { SentenceDifficulty } from "./types";

export const sentencePools: Record<SentenceDifficulty, string[]> = {
  easy: [
    "Keep your fingers on the home row and press each key with calm control. Move only the finger you need, and return to the starting position after every key. Slow and correct typing builds stronger habits than fast and careless typing.",
    "Sit up straight, relax your shoulders, and look at the screen. Type one word at a time and keep a steady rhythm. If you make a mistake, fix it, breathe, and continue with clean movement.",
    "Practice for a short time every day instead of rushing once a week. Repetition helps your hands remember where keys are. Consistent sessions will make your typing smoother and more accurate.",
    "Use both hands and let each finger do its own job. Avoid reaching with one strong finger for every key. Balanced movement reduces tension and makes long typing sessions easier.",
    "Start slowly, then increase speed only when accuracy stays high. Correct technique comes first, and speed follows naturally. Good habits today prevent frustration tomorrow.",
    "Place your index fingers on F and J and let your hands stay relaxed. Type short lines with steady timing and avoid sudden jumps. A smooth pace helps you make fewer mistakes.",
    "Keep your eyes on the text and trust your finger map. When you feel lost, pause for a second and return to home row. Calm practice is better than rushing.",
    "Use light key pressure and clear hand movement for each character. Heavy tapping can make your hands tired too early. Efficient motion keeps your typing comfortable.",
    "Practice common words and simple sentences before trying complex content. Your goal is clean form and stable rhythm. Strong basics make hard tasks easier later.",
    "If one key feels difficult, repeat it in short bursts with the correct finger. Then return to normal text and keep the same control. This builds confidence step by step.",
    "Keep both thumbs ready for space and avoid using one hand for everything. Balanced typing spreads the workload across your fingers. That balance improves speed over time.",
    "Read one line, then type it with focus and patience. Try to keep errors low instead of chasing high speed. Accuracy first creates long-term progress.",
    "A short daily session is enough when your technique is consistent. Ten focused minutes can teach better habits than one random long session. Repetition matters most.",
    "Hold a steady rhythm from the first word to the last word. Stop only when you need to correct an error properly. Clean corrections prevent repeated mistakes.",
    "End your session with a calm review of weak keys. Repeat those keys slowly and finish with a clean paragraph. This routine helps your hands remember correct movement."
  ],
  medium: [
    "Typing skill improves when rhythm, posture, and accuracy work together in every session. Keep your wrists neutral, avoid pressing keys too hard, and stay focused on smooth transitions between words. Small improvements repeated daily create long-term control.",
    "A useful routine is simple: warm up on home row patterns, type short paragraphs, and review weak keys at the end. This structure gives your brain clear repetition without boredom. Over time, error frequency drops and confidence increases.",
    "When you notice repeated mistakes on one finger, isolate that pattern and drill it with intention. Short targeted practice is more effective than random long practice. Precision before speed keeps progress stable.",
    "Good typing is not only about words per minute; it is also about consistency under pressure. If your pace changes too much, slow down and restore control. Stable timing helps your hands learn reliable motion paths.",
    "During practice, watch for common signs of tension such as raised shoulders or tight hands. Relax, reset your posture, and continue with lighter key presses. Efficient movement protects your hands and improves endurance.",
    "Build consistency by dividing your session into warm-up, main paragraph, and weak-key correction phases. This structure keeps attention high and reduces random mistakes. A clear routine makes progress easier to track.",
    "Moderate difficulty texts should include punctuation and varied word length without overwhelming complexity. This pushes coordination while keeping confidence stable. Controlled challenge is more useful than chaos.",
    "When you miss a key, avoid panic corrections and return to a measured rhythm quickly. Fast but messy recovery usually creates another error. Calm resets keep your flow intact.",
    "Track your weak fingers over several sessions instead of judging one attempt. Patterns become visible only with repeated data. Use those patterns to plan targeted drills.",
    "Try alternating between short and medium paragraphs during one practice block. The variation improves focus and helps transfer skill to different writing situations. Adaptability is part of typing mastery.",
    "Keep sentence transitions smooth by preparing your fingers before punctuation. Anticipation reduces hesitation and accidental key reaches. Better planning leads to cleaner execution.",
    "A useful checkpoint is stable accuracy above your normal baseline across three sessions in a row. Once stable, increase pace slightly without changing technique. Progress should feel controlled, not forced.",
    "If your ring or pinky finger falls behind, reduce speed and run dedicated patterns for that finger group. Precision under low speed creates stronger control later. Speed should return only after form improves.",
    "Use practical text with realistic wording so training feels close to daily typing tasks. Realistic content improves retention and transfer to work. Relevance increases motivation.",
    "Finish medium sessions by typing one paragraph in a single continuous rhythm. Note where your timing breaks and what key caused hesitation. Use that note as your next session target."
  ],
  hard: [
    "Reliable typing performance requires deliberate control across punctuation, capitalization, and mixed character groups within longer passages. Maintain finger discipline while transitioning through commas, periods, parentheses, and symbols like !@#$% without collapsing into one-finger compensation patterns.",
    "Under moderate speed pressure, many typists sacrifice structure and begin reaching with the wrong hand, which increases downstream errors and correction cost. Preserve home-row recovery after each burst, prioritize clean key sequences, and treat every correction as a technical reset rather than a failure.",
    "Advanced practice should combine semantic paragraphs with mechanical challenges such as number clusters, shifted symbols, and irregular word lengths. For example, type controlled fragments like 2026, 314159, and ratio-based notes while keeping consistent cadence and accurate finger assignment.",
    "Endurance sessions reveal hidden weaknesses in ring and pinky coordination, especially when punctuation density rises. Instead of chasing temporary speed spikes, focus on repeatable execution quality over full paragraphs, then increase pace only after accuracy remains stable across multiple runs.",
    "High-quality typing in real work contexts depends on resilient technique, not isolated drills alone. Train with realistic paragraph blocks, recover quickly from mistakes, and sustain posture, rhythm, and hand balance so performance remains dependable over long writing tasks.",
    "Complex passages with nested punctuation demand disciplined transitions between letters, symbols, and spacing behavior under time pressure. Maintain consistent finger ownership even when token shape changes rapidly, and avoid substituting convenience reaches that degrade long-term control.",
    "Error recovery at advanced level should preserve rhythm memory rather than trigger full stop behavior after every miss. Correct with intent, re-enter flow, and continue tracking cadence quality across the remaining paragraph to build resilient execution.",
    "Hard-mode practice should rotate between narrative text, technical phrasing, and mixed-format lines that include numbers like 2048 and symbols such as % and #. This variation exposes weak coordination paths that simple prose often hides.",
    "Keep cognitive load manageable by segmenting dense paragraphs into logical clauses while maintaining mechanical continuity. Clause awareness improves anticipation for punctuation zones and reduces abrupt tempo collapse near sentence boundaries.",
    "Advanced typists benefit from controlled speed ladders that increase pace only after repeatable accuracy thresholds are met across full paragraphs. One high-speed attempt is less meaningful than three stable, technically clean runs.",
    "In difficult content, pinky and ring performance often determines overall stability more than index speed. Protect those fingers with intentional drills, then re-test in paragraph context to confirm transfer of control.",
    "Sustainable performance requires low-tension mechanics across extended sessions; monitor shoulder elevation, wrist stiffness, and unnecessary key force. Mechanical efficiency becomes critical when complexity and duration increase together.",
    "Mixed punctuation blocks, for example parenthetical clauses and comma-separated lists, should be treated as coordination checkpoints rather than random obstacles. Pre-positioning and cadence planning reduce disruption in these high-risk segments.",
    "Use post-session analysis to capture three concrete facts: where rhythm broke, which finger failed first, and which character cluster triggered correction loops. Converting observations into next-session drills makes hard practice actionable.",
    "The objective of hard mode is robust real-world typing, where speed, precision, and recovery quality remain stable in long-form writing. Train for repeatability under varied constraints, not just isolated peak performance moments."
  ]
};

export function getSentencePool(difficulty: SentenceDifficulty): string[] {
  return sentencePools[difficulty];
}

