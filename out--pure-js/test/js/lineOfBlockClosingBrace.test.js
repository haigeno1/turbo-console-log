import * as assert from "assert";
import * as vscode from "vscode";
import Mocha from "mocha";
import { openDocument } from "../helpers";
import { JSDebugMessage } from "../../debug-message/js";
import { JSLineCodeProcessing } from "../../line-code-processing/js";
import { LocElement } from "../../entities";
test("Determine the closing brace line num", async () => {
    const jsLineCodeProcessing = new JSLineCodeProcessing();
    const jsDebugMessage = new JSDebugMessage(jsLineCodeProcessing);
    await openDocument("../files/js/lineOfBlockClosingBrace.ts");
    const { activeTextEditor } = vscode.window;
    if (activeTextEditor) {
        assert.strictEqual(jsDebugMessage.closingElementLine(activeTextEditor.document, 0, LocElement.Braces), 4);
        assert.strictEqual(jsDebugMessage.closingElementLine(activeTextEditor.document, 1, LocElement.Braces), 3);
    }
    Mocha.afterEach(async () => {
        await vscode.commands.executeCommand("workbench.action.closeActiveEditor", []);
    });
});
//# sourceMappingURL=lineOfBlockClosingBrace.test.js.map