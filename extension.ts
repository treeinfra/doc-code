import * as vscode from "vscode"
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node"

let client: LanguageClient | undefined

export function activate(context: vscode.ExtensionContext) {
  const serverModule = context.asAbsolutePath("middleware.js")
  const serverOptions: ServerOptions = {
    run: {module: serverModule, transport: TransportKind.ipc},
    debug: {module: serverModule, transport: TransportKind.ipc},
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      {scheme: "file", language: "typescript"},
      {scheme: "file", language: "javascript"},
    ],
  }

  client = new LanguageClient("doc-code", serverOptions, clientOptions)
  client?.start()
}

export function deactivate() {
  return client?.stop()
}
