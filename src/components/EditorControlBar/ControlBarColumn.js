import type { Element as ReactElement } from 'react';
import React from 'react';
import withRadium from 'radium';
import styles from './ControlBarColumn.styles';

type Alignment = 'left' | 'center' | 'right'

type Props = {
    children: ReactElement<any>,
    align: Alignment
};

function mapAlignmentToStyles (align: Alignment): string {
    const mappings = {
        center: 'center',
        left: 'flex-start',
        right: 'flex-end'
    };

    if (align === 'center') {
        return {
            justifyContent: mappings[align]
        };
    }

    const marginOffsetSide = (
        align === 'left' ?
        'marginLeft' :
        'marginRight'
    );

    return {
        justifyContent: mappings[align],
        [marginOffsetSide]: -16
    };
}

const ControlBarColumn = ({ children, align = 'center' }: Props) => (
    <div style={[ styles.container, mapAlignmentToStyles(align) ]}>
        {children}
    </div>
);

export default withRadium(ControlBarColumn);
