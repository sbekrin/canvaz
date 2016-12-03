import React, { Component } from 'react';
import withRadium from 'radium';
import styles from './EditorToolbarSection.styles';

type Props = {
    children: any // TODO
};

class EditorToolbarSection extends Component {
    props: Props;

    render () {
        return (
            <div style={styles.panel}>
                {this.props.children}
            </div>
        );
    }
}

export default withRadium(EditorToolbarSection);
