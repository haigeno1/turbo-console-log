import * as vscode from "vscode";
import * as path from "path";
export default async function openDocument(documentPath) {
    const uri = path.join(__dirname, documentPath);
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);
}
//# sourceMappingURL=openDocument.js.map