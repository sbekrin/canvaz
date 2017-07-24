import theme from '~/themes/default';
import cogIcon from '~/assets/icons/cog.svg';
import dragIcon from '~/assets/icons/drag.svg';
import trashIcon from '~/assets/icons/trash.svg';
import leftUpArrowIcon from '~/assets/icons/left-up-arrow.svg';

export default {
  wrapper: {
    transform: 'translateZ(0)', // Fix animation glitch in Safari
    transition: 'opacity 200ms ease',
    visibility: 'hidden',
    pointerEvents: 'none',
    position: 'absolute',
    userSelect: 'none',
    marginTop: -32,
    height: 32,
    opacity: 0,
    visible: {
      opacity: 1,
      visibility: 'visible',
      zIndex: 9999,
    },
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    transition: 'top 0.2s ease',
    position: 'relative',
    height: 'inherit',
    width: 'inherit',
    bottom: -10,
  },
  control: {
    transition: 'background-color 200ms ease, box-shadow 200ms ease',
    color: theme.colors.primary,
    whiteSpace: 'nowrap',
    fontSize: 11,
    textTransform: 'uppercase',
    display: 'block',
    pointerEvents: 'initial',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    minWidth: 22,
    height: 22,
    lineHeight: 1,
    boxSizing: 'border-box',
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    borderRadius: 2,
    margin: 0,
    roundedRight: {
      borderRightWidth: 0,
      borderRadius: '2px 0 0 2px',
    },
    roundedLeft: {
      borderLeftWidth: 0,
      borderRadius: '0 2px 2px 0',
    },
    up: {
      backgroundImage: `url(${leftUpArrowIcon})`,
      backgroundPosition: '0px 50%',
      cursor: 'pointer',
      paddingLeft: 16,
      ':hover': {
        backgroundColor: theme.colors.backgroundHover,
      },
    },
    setup: {
      backgroundImage: `url(${cogIcon})`,
      backgroundPosition: '4px 50%',
      userSelect: 'none',
      cursor: 'pointer',
      paddingLeft: 22,
      ':hover': {
        backgroundColor: theme.colors.backgroundHover,
      },
    },
    drag: {
      backgroundImage: `url(${dragIcon})`,
      cursor: '-webkit-grab',
      width: 60,
    },
    remove: {
      backgroundImage: `url(${trashIcon})`,
      cursor: 'pointer',
      width: 21,
      ':hover': {
        backgroundColor: theme.colors.backgroundHover,
      },
    },
  },
};
