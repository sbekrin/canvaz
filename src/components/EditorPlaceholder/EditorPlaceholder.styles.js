import theme from '~/themes/default';
import StyleConstants from '~/constants/StyleConstants';

const arrowSize = 5;

export default {
  container: {
    transition: 'top 100ms ease, left 100ms ease, width 100ms ease',
    animation: `${StyleConstants.PULSE_ANIMATION_NAME} 1s infinite`,
    position: 'absolute',
    pointerEvents: 'none',
    textAlign: 'center',
    userSelect: 'none',
  },
  line: {
    display: 'block',
    backgroundColor: theme.colors.primary,
    width: '100%',
    border: 'none',
    padding: 0,
    margin: 0,
    height: theme.border.width,
  },
  arrow: {
    borderStyle: 'solid',
    borderColor: 'rgba(66, 129, 244, 0)',
    borderWidth: arrowSize,
    position: 'absolute',
    marginTop: -1 * arrowSize,
    top: '50%',
    content: '',
    height: 0,
    width: 0,
    left: {
      borderLeftColor: theme.colors.primary,
      left: 0,
    },
    right: {
      borderRightColor: theme.colors.primary,
      right: 0,
    },
  },
};
