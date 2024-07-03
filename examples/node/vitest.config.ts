// vite.config.ts
/// <reference types="vitest" />
import {defineConfig} from "vitest/config"

export default defineConfig({
  test: {
    includeSource: ["sample*.{ts,js,cjs}"],
  },
  define: {"import.meta.vitest": "undefined"},
})
