import theme from 'themes/default';

export default {
    container: {
        fontFamily: 'sans-serif',
        backgroundColor: theme.colors.primary,
        paddingBottom: 2
    },
    label: {
        textTransform: 'uppercase',
        color: theme.colors.text,
        letterSpacing: 1,
        fontWeight: 'normal',
        userSelect: 'none',
        fontSize: 11,
        display: 'block',
        padding: '15px 10px',
        margin: 0
    },
    contents: {
        backgroundColor: theme.colors.background,
        boxSizing: 'border-box',
        position: 'relative',
        borderRadius: 2,
        overflowY: 'hidden',
        overflowX: 'hidden',
        display: 'block',
        padding: 10,
        margin: '0 2px'
    }
};
