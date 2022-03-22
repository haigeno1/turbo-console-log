import { LocElement } from "../entities";
export class DebugMessage {
    lineCodeProcessing;
    constructor(lineCodeProcessing) {
        this.lineCodeProcessing = lineCodeProcessing;
    }
    closingElementLine(document, lineNum, locElement) {
        const docNbrOfLines = document.lineCount;
        let closingElementFound = false;
        let openedElementOccurrences = 0;
        let closedElementOccurrences = 0;
        while (!closingElementFound && lineNum < docNbrOfLines - 1) {
            const currentLineText = document.lineAt(lineNum).text;
            const openedClosedElementOccurrences = this.locOpenedClosedElementOccurrences(currentLineText, locElement);
            openedElementOccurrences +=
                openedClosedElementOccurrences.openedElementOccurrences;
            closedElementOccurrences +=
                openedClosedElementOccurrences.closedElementOccurrences;
            if (openedElementOccurrences === closedElementOccurrences) {
                closingElementFound = true;
                return lineNum;
            }
            lineNum++;
        }
        return lineNum;
    }
    locOpenedClosedElementOccurrences(loc, locElement) {
        let openedElementOccurrences = 0;
        let closedElementOccurrences = 0;
        const openedElement = locElement === LocElement.Parenthesis ? /\(/g : /{/g;
        const closedElement = locElement === LocElement.Parenthesis ? /\)/g : /}/g;
        while (openedElement.exec(loc)) {
            openedElementOccurrences++;
        }
        while (closedElement.exec(loc)) {
            closedElementOccurrences++;
        }
        return {
            openedElementOccurrences,
            closedElementOccurrences,
        };
    }
    lineText(document, line) {
        return document.lineAt(line).text;
    }
}
//# sourceMappingURL=index.js.map