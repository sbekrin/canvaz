/* @flow */
import type { Element as ReactElement } from 'react';
import React from 'react';
import withRadium from 'radium';
import styles from './ControlPlaceholder.styles';

type Props = {
    children: ReactElement<any>
};

const ControlPlaceholder = ({ children, ...rest }: Props) => (
    <div {...rest} style={styles.container}>
        {children}
    </div>
);

export default withRadium(ControlPlaceholder);
