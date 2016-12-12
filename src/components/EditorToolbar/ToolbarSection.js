import React, { Component } from 'react';
import withRadium from 'radium';
import styles from './ToolbarSection.styles';

type Props = {
    children: any,
    label: string
};

class ToolbarSection extends Component {
    props: Props;

    render () {
        return (
            <div style={styles.container}>
                <div style={styles.label}>{this.props.label}</div>
                <div style={styles.contents}>{this.props.children}</div>
            </div>
        );
    }
}

export default withRadium(ToolbarSection);
