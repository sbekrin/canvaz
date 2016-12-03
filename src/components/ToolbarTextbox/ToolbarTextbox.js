import React, { Component } from 'react';
import radium from 'radium';
import styles from './ToolbarTextbox.styles';

type TextBoxProps = {
    label: string,
    prop: string
};

class ToolbarTextbox extends Component {
    props: TextBoxProps;

    render () {
        const { label, prop } = this.props;
        const id = `label-for-${prop}-input`;

        return (
            <div style={styles.container}>
                <label htmlFor={id}>
                    <span style={styles.label}>{label}</span>
                    <input id={id} style={styles.input} type="text" />
                </label>
            </div>
        );
    }
}

export default radium(ToolbarTextbox);
