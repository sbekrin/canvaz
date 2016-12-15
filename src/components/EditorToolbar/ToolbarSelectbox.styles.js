import chevronIcon from 'assets/icons/chevron-down.svg';

export default {
    container: {
        fontSize: 12
    },
    layout: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 6,
        paddingBottom: 6
    },
    label: {
        paddingBottom: 4,
        fontWeight: 'bold'
    },
    select: {
        background: `url(${chevronIcon})`,
        backgroundPosition: '100% 50%',
        backgroundRepeat: 'no-repeat',
        WebkitAppearance: 'none',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ccc',
        backgroundColor: 'transparent',
        outline: 'none',
        borderRadius: 2,
        font: 'inherit',
        padding: 6
    }
};
