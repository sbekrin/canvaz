/* @flow */
/**
 * Inserts text at current cursor position
 *
 * @see http://stackoverflow.com/questions/2920150/insert-text-at-cursor-in-a-content-editable-div/2925633#2925633
 */
export function insertTextAtCursor (text: string): void {
    if (window.getSelection) {
        const selection: Selection = window.getSelection();
        if (selection.getRangeAt && selection.rangeCount) {
            const range: Range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
        }
    } else if (document.selection && document.selection.createRange) {
        // $FlowFixMe: IE9 and less has custom selection API
        document.selection.createRange().text = text;
    }
}
