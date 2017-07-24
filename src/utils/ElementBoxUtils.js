/* @flow */
type ElementBox = {
  top: number,
  right: number,
  bottom: number,
  left: number,
  width: number,
  height: number,
};

/**
 * Calculates element box position with scroll position included
 */
export function getElementBox(element: HTMLElement): ElementBox {
  const rect: ClientRect = element.getBoundingClientRect();
  const scrollTop: number =
    window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft: number =
    window.pageXOffset || document.documentElement.scrollLeft;

  return {
    top: Math.floor(rect.top + scrollTop),
    right: rect.right,
    bottom: rect.bottom,
    left: Math.floor(rect.left + scrollLeft),
    width: rect.width,
    height: rect.height,
  };
}
