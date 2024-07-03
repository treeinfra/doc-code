import {TextDocument} from "vscode-languageserver-textdocument"
import {
  ProposedFeatures,
  TextDocumentSyncKind,
  TextDocuments,
  createConnection,
} from "vscode-languageserver/node"

const connection = createConnection(ProposedFeatures.all)
const documents = new TextDocuments(TextDocument)

connection.onInitialize(function (_) {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      completionProvider: {resolveProvider: true},
    },
  }
})

// todo is that really necessary?
connection.onCompletion(function (params) {
  const document = documents.get(params.textDocument.uri)
  if (!document) return null
  return []
})

connection.listen()
