const modifierKeys = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab"]);

export function isModifierKey(key: string): boolean {
  return modifierKeys.has(key);
}

export function normalizeKey(rawKey: string): string {
  if (rawKey === " ") {
    return "space";
  }

  if (rawKey === "Spacebar") {
    return "space";
  }

  if (rawKey.length === 1) {
    return rawKey.toLowerCase();
  }

  return rawKey;
}

export function fromContentToStream(content: string): string[] {
  return content
    .split("")
    .map((char) => (char === " " ? "space" : char.toLowerCase()))
    .filter((char) => char.length > 0);
}

export function renderKeyLabel(key: string): string {
  if (key === "space") {
    return "Space";
  }
  return key;
}
