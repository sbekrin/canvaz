import { css, keyframes } from 'styled-components';

const pulseAnimation = keyframes`
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.025); }
  100% { opacity: 0.2; transform: scale(1); }
`;

export function base() {
  return css`
    // Enable animations
    transition-duration: 100ms;
    transition-property: outline-color, background-color;
    outline: 2px solid transparent;

    // Highlight component on click
    :focus {
      outline-color: rgb(59, 153, 252);
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

export function hovered() {
  return css`
    // Visually show component boundary on hover
    outline-color: rgba(59, 153, 252, 0.5);
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

export function grabbed() {
  return css`
    animation: ${pulseAnimation} 1s ease infinite;
  `;
}
