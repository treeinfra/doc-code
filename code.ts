export type EmbeddedLanguageContent = {
  languageId: string
  content: string
}

/**
 * Detect the language id of the code inside doc.
 *
 * 1. If current document is an unsupported language, return undefined.
 * 2. If current position is not inside an embedded doc code, return undefined.
 * 3. If current position is inside doc code, return the detected content.
 * 4. Even if txt, it will return `"plaintext"` as language id.
 *
 * @param languageId The language id of current document.
 * @param content The content of current document.
 * @param offset The offset of the position in current document.
 * @returns Parsed embedded language content or undefined.
 */
export function detectDocCodeLanguage(
  languageId: string,
  content: string,
  offset: number,
): EmbeddedLanguageContent | undefined {
  if (languageId === "typescript") return detectTypescript(content, offset)
  return undefined
}

function detectTypescript(
  content: string,
  offset: number,
): EmbeddedLanguageContent | undefined {
  return undefined
}

if (import.meta.vitest) {
  const {test} = import.meta.vitest
  test("detect typescript", () => {})
}
