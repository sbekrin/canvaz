import React, { Component } from 'react';
import withRadium from 'radium';
import type ToolbarSection from './ToolbarSection';
import styles from './EditorToolbar.styles';

type Props = {
    children: ToolbarSection
};

class EditorToolbar extends Component {
    props: Props;

    render () {
        return (
            <div style={styles.container}>
                {this.props.children}
            </div>
        );
    }
}

export default withRadium(EditorToolbar);
