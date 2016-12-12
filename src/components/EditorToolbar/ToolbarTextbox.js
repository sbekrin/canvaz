import React, { Component } from 'react';
import withRadium from 'radium';
import { connectProperty } from 'utils/PropertyConnectorUtils';
import styles from './ToolbarTextbox.styles';

type TextboxProps = {
    label: string,
    value: any,
    onChange: (newValue: any) => void
};

class ToolbarTextbox extends Component {
    props: TextboxProps;

    render () {
        const { label } = this.props;

        return (
            <div style={styles.container}>
                <label style={styles.layout} htmlFor={this.id}>
                    <span style={styles.label}>{label}</span>
                    <input
                        id={this.id}
                        style={styles.input}
                        type="text"
                        onChange={this.props.onChange}
                        value={this.props.value}
                    />
                </label>
            </div>
        );
    }
}

export default connectProperty(withRadium(ToolbarTextbox));
