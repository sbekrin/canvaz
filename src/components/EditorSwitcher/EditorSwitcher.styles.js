import theme from '~/themes/default';

export default {
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    margin: 0,
    outline: 'none',
    fontFamily: 'sans-serif',
    fontSize: 14,
    cursor: 'pointer',
    userSelect: 'none',
    color: '#777',
    ':hover': {
      color: '#4281f4',
    },
    active: {
      cursor: 'default',
      ':hover': {
        color: '#777',
      },
    },
  },
  switcher: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(68, 68, 68, 0.5)',
    borderRadius: 20,
    marginLeft: 6,
    marginRight: 6,
    position: 'relative',
    height: 12,
    width: 40,
    toggled: {
      borderColor: theme.colors.primary,
    },
  },
  bullet: {
    transition: 'margin 200ms ease',
    backgroundColor: 'rgba(68, 68, 68, 0.4)',
    boxSizing: 'border-box',
    borderRadius: 12,
    display: 'block',
    width: 10,
    height: 10,
    marginTop: 1,
    marginLeft: 28,
    toggled: {
      backgroundColor: theme.colors.primary,
      marginLeft: 2,
    },
  },
};
