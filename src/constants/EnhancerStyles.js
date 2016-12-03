/* @flow */
import StyleConstants from 'constants/StyleConstants';
import theme from 'themes/default';

const isSafari: boolean = (
    navigator.userAgent.toLowerCase().indexOf('safari') > -1 &&
    navigator.userAgent.toLowerCase().indexOf('chrome') === -1
);

const highlightStyles = {
    transition: 'outline 200ms ease',
    outline: `${theme.border.width}px solid ${theme.colors.primary}`,
    outlineOffset: isSafari ? 0 : 4, // Safari has rendering issues with outline-offset
    zIndex: 999
};

export default {
    active: {
        outline: '2px solid transparent'
    },
    hover: highlightStyles,
    focus: highlightStyles,
    drag: {
        animation: `${StyleConstants.PULSE_ANIMATION_NAME} 1s infinite`,
        outline: `${theme.border.width} solid ${theme.colors.primary}`,
        outlineOffset: 4,
        pointerEvents: 'none'
    }
};
