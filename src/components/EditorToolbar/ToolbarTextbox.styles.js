import theme from '~/themes/default';

export default {
  container: {
    fontSize: 12,
  },
  layout: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 6,
    paddingBottom: 6,
  },
  label: {
    paddingBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: theme.border.width,
    borderColor: '#ccc',
    borderStyle: 'solid',
    padding: 6,
    borderRadius: 2,
    font: 'inherit',
    ':focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
    },
  },
};
