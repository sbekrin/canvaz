import { css } from 'styled-components';

export function base() {
  return css`
    // Enable animations
    transition-duration: 100ms;
    transition-property: box-shadow, background-color;

    // Highlight component on click
    :focus {
      box-shadow: 0 0 0 2px rgb(59, 153, 252);
      outline: none;
    }

    // Don't let empty components to collapse
    :empty:after {
      color: black;
      font-weight: bold;
      text-transform: lowercase;
      font-variant: small-caps;
      content: '∅ ' attr(aria-label);
      display: flex;
      height: 100%;
      width: 100%;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 0 2px #666;
      font-family: sans-serif;
      opacity: 0.25;
    }

    // Set cursor depending on contenteditable attr
    &:not([contenteditable="true"]) { cursor: pointer; }
    &[contenteditable="true"] { cursor: text; }
  `;
}

export function highlighted() {
  return css`
    // Visually show component boundary on hover
    box-shadow: 0 0 0 2px rgba(59, 153, 252, 0.5);
    background-color: rgba(59, 153, 252, 0.1);
  `;
}

export function voided() {
  return css`
    // Disallow iteractions for empty components
    * {
      pointer-events: none;
    }
  `;
}
