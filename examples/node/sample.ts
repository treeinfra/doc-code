/**
 * The following test is a doctest.
 *
 * ```ts
 * const {it, expect} = import.meta.vitest
 * it("add", () => {
 *   expect(add()).toBe(0)
 *   expect(add(1)).toBe(1)
 *   expect(add(1, 2, 3)).toBe(6)
 * })
 * ```
 *
 * @param args numbers to add together.
 * @returns result of all the {@link args}.
 */
export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0)
}

if (import.meta.vitest) {
  const {it, expect} = import.meta.vitest
  it("add", () => {
    expect(add()).toBe(0)
    expect(add(1)).toBe(1)
    expect(add(1, 2, 3)).toBe(6)
  })
}
