const languageExtensions = {
  typescript: "ts",
}

/**
 * Resolve suffix for a virtual file according to its detected language id.
 * If the language id is not supported,
 * it will use `txt` (plaintext) as default.
 *
 * @param languageId LanguageID specified by vscode.
 * @returns Suffix of the resolved virtual file.
 */
export function resolveSuffix(languageId: string): string {
  return languageId in languageExtensions
    ? `.${languageExtensions[languageId]}`
    : "txt"
}

export type EmbeddedLanguageContent = {
  /** Index of the code blocks inside current document. */
  index: number

  /** Language id of current code block, specified by vscode. */
  languageId: string

  /**
   * Content of the processed code block:
   *
   * All other contents will be replaced by space with same length
   * to mark the same position for the trace in analyze process,
   * and the raw code will remain the same.
   */
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
  if (languageId === "markdown") return detectMarkdown(content, offset)
  if (languageId === "typescript") return detectTypescript(content, offset)
  return undefined
}

function detectMarkdown(
  content: string,
  offset: number,
): EmbeddedLanguageContent | undefined {
  const lines = content.split("\n")
  const codeBlocks: [number, number][] = []
  let inCodeBlock = false
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trimStart().startsWith("```")) {
    }
  }
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
