import React, { Component } from 'react';
import radium from 'radium';
import styles from './EditorToolbar.styles';

class EditorSidebar extends Component {
    render () {
        return (
            <div style={styles.container} />
        );
    }
}

export default radium(EditorSidebar);
