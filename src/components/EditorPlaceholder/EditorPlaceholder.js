/* @flow */
import type { Element as ReactElement } from 'react';
import React, { Component } from 'react';
import radium from 'radium';
import styles from './EditorPlaceholder.styles';

type Props = {
    x: number,
    y: number,
    width: number
};

type PlaceholderPositionBox = {
    left: number,
    top: number,
    width: number
};

class EditorPlaceholder extends Component {
    props: Props;

    render (): ReactElement<any> {
        const positionAndSize: PlaceholderPositionBox = {
            left: this.props.x,
            top: this.props.y,
            width: this.props.width
        };

        return (
            <div style={[ styles.container, positionAndSize ]}>
                <span style={[ styles.arrow, styles.arrow.left ]} />
                <hr style={styles.line} />
                <span style={[ styles.arrow, styles.arrow.right ]} />
            </div>
        );
    }
}

export default radium(EditorPlaceholder);
