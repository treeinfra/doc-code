// Attention that this import of vscode is provided by vscode extension host.
// There's no real code when running in node,
// that all test inside current file will fail because of this import.
// So don't test directly inside this file.
import {
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionList,
  ExtensionContext,
  Position,
  ProviderResult,
  TextDocument,
  Uri,
  workspace,
} from "vscode"
import {
  LanguageClient,
  LanguageClientOptions,
  ProvideCompletionItemsSignature,
  ServerOptions,
  TransportKind,
} from "vscode-languageclient/node"
import {detectDocCodeLanguage} from "./code"

/**
 * The language service client is handled as a global variable
 * in order to be canceled safely when the extension deactivated.
 */
let client: LanguageClient | undefined

export function activate(context: ExtensionContext) {
  // Handle all virtual documents of embedded code in doc.
  const virtualDocumentHandler = new Map<string, string>()
  workspace.registerTextDocumentContentProvider("doc-code", {
    provideTextDocumentContent: function (uri, token) {
      return virtualDocumentProvider(virtualDocumentHandler, uri, token)
    },
  })

  // Introduce the server code into vscode server host.
  const serverOptions: ServerOptions = {
    module: context.asAbsolutePath("middleware.js"),
    transport: TransportKind.ipc,
  }

  // Register the middleware to hijack language service and
  // create virtual documents for embedded code in docs
  // for all supported file types (language id).
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{scheme: "file", language: "typescript"}],
    middleware: {provideCompletionItem: provideEmbeddedCompletion},
  }

  // Launch the client with configured options.
  client = new LanguageClient("doc-code", serverOptions, clientOptions)
  client?.start()
}

export function deactivate() {
  return client?.stop()
}

function virtualDocumentProvider(
  handler: Map<string, string>,
  uri: Uri,
  token: CancellationToken,
): ProviderResult<string> {
  return ""
}

function provideEmbeddedCompletion(
  document: TextDocument,
  position: Position,
  context: CompletionContext,
  token: CancellationToken,
  next: ProvideCompletionItemsSignature,
): ProviderResult<CompletionItem[] | CompletionList> {
  const lang = detectDocCodeLanguage(
    document.languageId,
    document.getText(),
    document.offsetAt(position),
  )
  if (!lang) return next(document, position, context, token)

  return next(document, position, context, token)
}
