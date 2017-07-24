import React, { Component } from 'react';
import withRadium from 'radium';
import { connectProperty } from '~/utils/PropertyConnectorUtils';
import styles from './ToolbarSelectbox.styles';

type TextboxProps = {
  label: string,
  value: any,
  options: Object,
  onChange: (newValue: string) => void,
};

class ToolbarSelectbox extends Component {
  props: TextboxProps;

  renderOption = optionCode =>
    <option value={optionCode} key={optionCode}>
      {this.props.options[optionCode]}
    </option>;

  render() {
    const { label, value, options } = this.props;

    return (
      <div style={styles.container}>
        <label style={styles.layout} htmlFor={this.id}>
          <span style={styles.label}>
            {label}
          </span>
          <select
            id={this.id}
            style={styles.select}
            value={value}
            onChange={this.props.onChange}
          >
            {Object.keys(options).map(this.renderOption)}
          </select>
        </label>
      </div>
    );
  }
}

export default withRadium(connectProperty(ToolbarSelectbox));
