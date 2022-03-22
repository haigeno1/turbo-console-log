import * as vscode from "vscode";
import { JSDebugMessage } from "./debug-message/js";
import { JSLineCodeProcessing } from "./line-code-processing/js";
export function activate(context) {
    const jsLineCodeProcessing = new JSLineCodeProcessing();
    const jsDebugMessage = new JSDebugMessage(jsLineCodeProcessing);
    // Insert debug message
    vscode.commands.registerCommand("turboConsoleLog.displayLogMessage", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const tabSize = getTabSize(editor.options.tabSize);
        const document = editor.document;
        const config = vscode.workspace.getConfiguration("turboConsoleLog");
        const properties = getExtensionProperties(config);
        for (let index = 0; index < editor.selections.length; index++) {
            const selection = editor.selections[index];
            const selectedVar = document.getText(selection);
            const lineOfSelectedVar = selection.active.line;
            // Check if the selection line is not the last one in the document and the selected variable is not empty
            if (selectedVar.trim().length !== 0) {
                await editor.edit((editBuilder) => {
                    const logMessageLine = jsDebugMessage.line(document, lineOfSelectedVar, selectedVar);
                    jsDebugMessage.msg(editBuilder, document, selectedVar, lineOfSelectedVar, properties.wrapLogMessage, properties.logMessagePrefix, properties.quote, properties.addSemicolonInTheEnd, properties.insertEnclosingClass, properties.insertEnclosingFunction, properties.delimiterInsideMessage, properties.includeFileNameAndLineNum, tabSize);
                });
            }
        }
    });
    // Comment all debug messages
    vscode.commands.registerCommand("turboConsoleLog.commentAllLogMessages", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const tabSize = getTabSize(editor.options.tabSize);
        const document = editor.document;
        const config = vscode.workspace.getConfiguration("turboConsoleLog");
        const properties = getExtensionProperties(config);
        const logMessages = jsDebugMessage.detectAll(document, tabSize, properties.delimiterInsideMessage, properties.quote);
        editor.edit((editBuilder) => {
            logMessages.forEach(({ spaces, lines }) => {
                lines.forEach((line) => {
                    editBuilder.delete(line);
                    editBuilder.insert(new vscode.Position(line.start.line, 0), `${spaces}// ${document.getText(line).trim()}\n`);
                });
            });
        });
    });
    // Uncomment all debug messages
    vscode.commands.registerCommand("turboConsoleLog.uncommentAllLogMessages", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const tabSize = getTabSize(editor.options.tabSize);
        const document = editor.document;
        const config = vscode.workspace.getConfiguration("turboConsoleLog");
        const properties = getExtensionProperties(config);
        const logMessages = jsDebugMessage.detectAll(document, tabSize, properties.delimiterInsideMessage, properties.quote);
        editor.edit((editBuilder) => {
            logMessages.forEach(({ spaces, lines }) => {
                lines.forEach((line) => {
                    editBuilder.delete(line);
                    editBuilder.insert(new vscode.Position(line.start.line, 0), `${spaces}${document.getText(line).replace(/\//g, "").trim()}\n`);
                });
            });
        });
    });
    // Delete all debug messages
    vscode.commands.registerCommand("turboConsoleLog.deleteAllLogMessages", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const tabSize = getTabSize(editor.options.tabSize);
        const document = editor.document;
        const config = vscode.workspace.getConfiguration("turboConsoleLog");
        const properties = getExtensionProperties(config);
        const logMessages = jsDebugMessage.detectAll(document, tabSize, properties.delimiterInsideMessage, properties.quote);
        editor.edit((editBuilder) => {
            logMessages.forEach(({ lines }) => {
                lines.forEach((line) => {
                    editBuilder.delete(line);
                });
            });
        });
    });
}
export function deactivate() { }
function getExtensionProperties(workspaceConfig) {
    const wrapLogMessage = workspaceConfig.wrapLogMessage || false;
    const logMessagePrefix = workspaceConfig.logMessagePrefix
        ? workspaceConfig.logMessagePrefix
        : "";
    const addSemicolonInTheEnd = workspaceConfig.addSemicolonInTheEnd || false;
    const insertEnclosingClass = workspaceConfig.insertEnclosingClass;
    const insertEnclosingFunction = workspaceConfig.insertEnclosingFunction;
    const quote = workspaceConfig.quote || '"';
    const delimiterInsideMessage = workspaceConfig.delimiterInsideMessage || "~";
    const includeFileNameAndLineNum = workspaceConfig.includeFileNameAndLineNum || false;
    const extensionProperties = {
        wrapLogMessage,
        logMessagePrefix,
        addSemicolonInTheEnd,
        insertEnclosingClass,
        insertEnclosingFunction,
        quote,
        delimiterInsideMessage,
        includeFileNameAndLineNum,
    };
    return extensionProperties;
}
function getTabSize(tabSize) {
    if (tabSize && typeof tabSize === "number") {
        return tabSize;
    }
    else if (tabSize && typeof tabSize === "string") {
        return parseInt(tabSize);
    }
    else {
        return 4;
    }
}
//# sourceMappingURL=extension.js.map