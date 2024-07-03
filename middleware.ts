import {ProposedFeatures, createConnection} from "vscode-languageserver/node"

const connection = createConnection(ProposedFeatures.all)

connection.listen()
