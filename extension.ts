// Attention that this import of vscode is provided by vscode extension host.
// There's no real code when running in node,
// that all test inside current file will fail because of this import.
// So don't test directly inside this file.
import {CompletionList, ExtensionContext, commands, workspace} from "vscode"
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node"
import {detectDocCodeLanguage, resolveSuffix} from "./language"

/**
 * The language service client is handled as a global variable
 * in order to be canceled safely when the extension deactivated.
 */
let client: LanguageClient | undefined

export function activate(context: ExtensionContext) {
  /**
   * Handle all registered virtual documents:
   * - key: virtual document uri.
   * - value: content string of virtual document.
   */
  const virtualDocumentHandler = new Map<string, string>()
  workspace.registerTextDocumentContentProvider("doc-code", {
    provideTextDocumentContent: function (uri) {
      return virtualDocumentHandler.get(uri.toString())
    },
  })

  // Introduce the server code into vscode server host.
  const serverOptions: ServerOptions = {
    command: "",

    // module: context.asAbsolutePath("middleware.js"),
    transport: TransportKind.ipc,
  }

  // Register the middleware to hijack language service and
  // create virtual documents for embedded code in docs
  // for all supported file types (language id).
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{scheme: "file", language: "typescript"}],
    middleware: {
      /**
       * Parse embedded code area, and if it is,
       * register them inside {@link virtualDocumentHandler}.
       * Then it will call the build-in command to provide completion
       * using default language service of current vscode environment.
       */
      async provideCompletionItem(document, position, context, token, next) {
        const lang = detectDocCodeLanguage(
          document.languageId,
          document.getText(),
          document.offsetAt(position),
        )
        if (!lang) return next(document, position, context, token)

        const virtualDocumentURI =
          "doc-code:" +
          encodeURIComponent(document.uri.toString(true)) +
          resolveSuffix(lang.languageId)

        virtualDocumentHandler.set(virtualDocumentURI, lang.content)
        return await commands.executeCommand<CompletionList>(
          "vscode.executeCompletionItemProvider",
          virtualDocumentURI,
          position,
          context.triggerCharacter,
          token,
        )
      },
    },
  }

  // Launch the client with configured options.
  client = new LanguageClient("doc-code", serverOptions, clientOptions)
  client?.start()
}

export function deactivate() {
  return client?.stop()
}
