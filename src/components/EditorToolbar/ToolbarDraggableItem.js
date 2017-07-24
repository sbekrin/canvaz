/* @flow */
import type { Element as ReactElement } from 'react';
import React, { Component } from 'react';
import withRadium from 'radium';
import styles from './ToolbarDraggableItem.styles';

type Props = {
  onDragStart: () => void,
  onDragEnd: () => void,
  children: any,
};

class ToolbarDraggableItem extends Component {
  props: Props;

  render(): ReactElement<any> {
    return (
      <div
        style={styles.container}
        draggable
        onDragStart={this.props.onDragStart}
        onDragEnd={this.props.onDragEnd}
      >
        <span style={styles.icon} aria-hidden="true">
          •
        </span>
        {this.props.children}
      </div>
    );
  }
}

export default withRadium(ToolbarDraggableItem);
