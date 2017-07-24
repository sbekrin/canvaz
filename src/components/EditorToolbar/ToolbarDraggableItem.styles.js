const iconColor = '#aaa';

export default {
  container: {
    fontSize: 12,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    borderRadius: 2,
    cursor: '-webkit-grab',
    paddingLeft: 26,
    transition: 'box-shadow 100ms ease',
    boxSizing: 'border-box',
    position: 'relative',
    ':hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.075)',
    },
  },
  icon: {
    color: iconColor,
    position: 'absolute',
    fontFamily: 'serif',
    fontSize: 8,
    left: 6,
    top: 6,
    textShadow: `
            0 5px ${iconColor},
            0 10px ${iconColor},
            5px 0 ${iconColor},
            10px 0 ${iconColor},
            10px 5px ${iconColor},
            5px 5px ${iconColor},
            5px 10px ${iconColor},
            10px 10px ${iconColor}
        `,
  },
};
