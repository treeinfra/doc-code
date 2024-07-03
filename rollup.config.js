import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import {defineConfig} from "rollup"

const common = defineConfig({
  plugins: [typescript(), terser()],
  external: [
    "vscode",
    "vscode-languageclient/node",
    "vscode-languageserver/node",
    "vscode-languageserver-textdocument",
  ],
})

const client = defineConfig({
  ...common,
  input: "extension.ts",
  output: {file: "extension/extension.js", format: "commonjs"},
})

const server = defineConfig({
  ...common,
  input: "middleware.ts",
  output: {file: "extension/middleware.js", format: "commonjs"},
})

export default defineConfig([client, server])
