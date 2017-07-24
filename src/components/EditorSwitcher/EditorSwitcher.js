/* @flow */
import React, { Component } from 'react';
import type { Element as ReactElement } from 'react';
import withRadium from 'radium';
import styles from './EditorSwitcher.styles';

type DefaultProps = {
  toggled: boolean,
  leftLabel: string,
  rightLabel: string,
};

type Props = {
  toggled: boolean,
  leftLabel: string,
  rightLabel: string,
  onToggle: (state: any) => boolean,
};

class EditorSwitcher extends Component {
  static defaultProps: DefaultProps = {
    toggled: false,
    leftLabel: 'Edit',
    rightLabel: 'View',
  };

  onToggle = state => {
    this.props.onToggle(state);
  };

  onSwitchOn = () => {
    this.onToggle(true);
  };

  onSwitchOff = () => {
    this.onToggle(false);
  };

  props: Props;

  render(): ReactElement<any> {
    const { toggled } = this.props;

    return (
      <div style={styles.container}>
        <button
          onClick={this.onSwitchOn}
          style={[styles.label, toggled && styles.label.active]}
          key="leftLabel"
        >
          {this.props.leftLabel}
        </button>
        <div style={[styles.switcher, toggled && styles.switcher.toggled]}>
          <div style={[styles.bullet, toggled && styles.bullet.toggled]} />
        </div>
        <button
          onClick={this.onSwitchOff}
          style={[styles.label, !toggled && styles.label.active]}
          key="rightLabel"
        >
          {this.props.rightLabel}
        </button>
      </div>
    );
  }
}

export default withRadium(EditorSwitcher);
