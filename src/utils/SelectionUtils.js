/* @flow */
/* @see http://stackoverflow.com/a/17694760 */
import type { SelectionData } from '~/types/EditorTypes';

/**
 * Saves current text selection
 */
export function saveSelection(target: HTMLElement): ?SelectionData {
  if (window.getSelection && document.createRange) {
    const owner = target.ownerDocument;
    const view = owner.defaultView;
    const range = view.getSelection().getRangeAt(0);
    const preRange = range.cloneRange();

    preRange.selectNodeContents(target);
    preRange.setEnd(range.startContainer, range.startOffset);

    const start = preRange.toString().length;
    const end = start + range.toString().length;

    return { start, end };
  }

  if (document.selection) {
    const owner = target.ownerDocument;
    // $FlowFixMe IE-related types
    const selectedRange = owner.selection.createRange();
    // $FlowFixMe IE-related types
    const preRange = owner.body.createTextRange();

    preRange.moveToElementText(target);
    preRange.setEndPoint('EndToStart', selectedRange);

    const start = preRange.text.length;
    const end = start + selectedRange.text.length;

    return { start, end };
  }

  return null;
}

/**
 * Restores text selection
 */
export function restoreSelection(
  target: HTMLElement,
  selection: SelectionData
): void {
  if (window.getSelection && document.createRange) {
    const owner = target.ownerDocument;
    const view = owner.defaultView;
    const range = owner.createRange();

    range.setStart(target, 0);
    range.collapse(true);

    const stack: Array<Node> = [target];
    let charIndex = 0;
    let foundStart = false;
    let stop = false;

    while (!stop && stack.length > 0) {
      const node = stack.pop();

      if (node.nodeType === 3) {
        // $FlowFixMe
        const nextCharIndex = charIndex + node.length;

        if (
          !foundStart &&
          selection.end >= charIndex &&
          selection.end <= nextCharIndex
        ) {
          range.setStart(node, selection.start - charIndex);
          foundStart = true;
        }

        if (
          foundStart &&
          selection.end >= charIndex &&
          selection.end <= nextCharIndex
        ) {
          range.setEnd(node, selection.end - charIndex);
          stop = true;
        }

        charIndex = nextCharIndex;
      } else {
        let i = node.childNodes.length;

        while (i > 0) {
          i -= 1;
          stack.push(node.childNodes[i]);
        }
      }
    }

    const restoredSelection = view.getSelection();
    restoredSelection.removeAllRanges();
    restoredSelection.addRange(range);

    return;
  }

  if (document.selection) {
    const owner = target.ownerDocument;
    // $FlowFixMe IE-related types
    const range = owner.body.createTextRange();

    range.moveToElementText(target);
    range.collapse(true);
    range.moveEnd('character', selection.end);
    range.moveStart('character', selection.start);
    range.select();
  }
}
