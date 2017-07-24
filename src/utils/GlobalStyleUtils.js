/* @flow */
import StyleConstants from '~/constants/StyleConstants';

// TODO: Move colors to constants
export function buildGlobalStyles() {
  return `
        @keyframes ${StyleConstants.PULSE_ANIMATION_NAME} {
            0% { opacity: 1 }
            50% { transform: scale(1.1); opacity: .2; }
            100% { opacity: 1 }
        }
        
        @keyframes ${StyleConstants.FLASH_ANIMATION_NAME} {
            0% { background-color: rgba(0, 0, 0, 0.1); }
            50% { background-color: rgba(0, 0, 0, 0.2); } 
            100% { background-color: rgba(0, 0, 0, 0.1); }
        }

        @keyframes ${StyleConstants.OUTLINE_PULSE_ANIMATION_NAME} {
            0% { outline-color: rgba(66, 129, 244, 0.8); }
            50% { outline-color: rgba(66, 129, 244, 0.2); }
            100% { outline-color: rgba(66, 129, 244, 0.8); }
        }

        .${StyleConstants.DRAG_IN_PROGRESS_CLASS} {
            cursor: move;
            cursor: -webkit-grabbing;
        }
        
        [${StyleConstants.VOID_COMPONENT_ATTRIBUTE}] * {
            pointer-events: none;
        }

        [${StyleConstants.EMPTY_COMPONENT_ATTRIBUTE}]::before {
            animation: ${StyleConstants.FLASH_ANIMATION_NAME} 2.5s infinite;
            content: 'Empty ' attr(aria-label);
            opacity: 0.5;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-family: sans-serif;
        }
    `;
}

export function createGlobalStyles() {
  if (!document.querySelector(`[${StyleConstants.GLOBAL_STYLES_ATTRIBUTE}]`)) {
    const styles = document.createElement('style');
    styles.setAttribute(StyleConstants.GLOBAL_STYLES_ATTRIBUTE, 'true');
    styles.innerHTML = buildGlobalStyles();
    document.head.appendChild(styles);
  }
}

export function destroyGlobalStyles() {
  const globalStylesRef = document.querySelector(
    `[${StyleConstants.GLOBAL_STYLES_ATTRIBUTE}]`
  );

  if (globalStylesRef) {
    document.head.removeChild(globalStylesRef);
  }
}
