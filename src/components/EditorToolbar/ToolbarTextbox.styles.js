import theme from 'themes/default';

export default {
    container: {
        fontSize: 12
    },
    layout: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        paddingBottom: 4,
        fontWeight: 'bold'
    },
    input: {
        borderWidth: theme.border.width,
        borderColor: '#ccc',
        borderStyle: 'solid',
        padding: 4,
        borderRadius: 2,
        font: 'inherit',
        ':focus': {
            outline: 'none',
            borderColor: theme.colors.primary
        }
    }
};
