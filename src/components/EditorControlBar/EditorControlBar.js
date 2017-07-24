/* @flow */
import type { Element as ReactElement } from 'react';
import React, { Component } from 'react';
import withRadium from 'radium';
import { getElementBox } from '~/utils/ElementBoxUtils';
import ControlBarColumn from './ControlBarColumn';
import ControlPlaceholder from './ControlPlaceholder';
import styles from './EditorControlBar.styles';

type DefaultProps = {
  visible: boolean,
  canDrag: boolean,
  canRemove: boolean,
};

type Props = {
  targetRef: HTMLElement,
  label: string,
  parentLabel: string,
  visible: boolean,
  canGoUp: boolean,
  canDrag: boolean,
  canRemove: boolean,
  onUp: () => void,
  onInspect: () => void,
  onDragStart: () => void,
  onRemove: () => void,
};

class ControlBar extends Component {
  static defaultProps: DefaultProps = {
    visible: false,
    canDrag: true,
    canRemove: true,
  };

  onInspect = (event: Event): void => {
    this.preventFocusLoss(event);
    this.props.onInspect();
  };

  onDragStart = (event: Event): void => {
    event.preventDefault();
    this.props.onDragStart();
  };

  onRemove = (event: Event): void => {
    this.preventFocusLoss(event);
    this.props.onRemove();
  };

  onControlMouseOver = (): void => {
    this.props.targetRef.focus();
  };

  preventFocusLoss = (event: Event): void => {
    event.preventDefault();
    this.props.targetRef.focus();
  };

  props: Props;

  renderLeftControls(): ReactElement<any> {
    const { canGoUp, onUp, label, parentLabel } = this.props;

    return (
      <ControlBarColumn align="left">
        <ControlPlaceholder onMouseOver={this.onControlMouseOver}>
          {canGoUp &&
            <button
              style={[
                styles.control,
                styles.control.up,
                styles.control.roundedRight,
              ]}
              onMouseDown={onUp}
              key="upAction"
            >
              {parentLabel}
            </button>}
          <button
            style={[
              styles.control,
              styles.control.setup,
              canGoUp && styles.control.roundedLeft,
            ]}
            onMouseDown={this.onInspect}
            key="inspectAction"
          >
            {label}
          </button>
        </ControlPlaceholder>
      </ControlBarColumn>
    );
  }

  renderMiddleControls(): boolean | ReactElement<any> {
    return (
      this.props.canDrag &&
      <ControlBarColumn align="center">
        <ControlPlaceholder onMouseOver={this.onControlMouseOver}>
          <span
            style={[styles.control, styles.control.drag]}
            onMouseDown={this.props.onDragStart}
            draggable
            key="dragAction"
          />
        </ControlPlaceholder>
      </ControlBarColumn>
    );
  }

  renderRightControls(): boolean | ReactElement<any> {
    return (
      this.props.canRemove &&
      <ControlBarColumn align="right">
        <ControlPlaceholder onMouseOver={this.onControlMouseOver}>
          <button
            style={[styles.control, styles.control.remove]}
            onMouseDown={this.onRemove}
            key="removeAction"
          />
        </ControlPlaceholder>
      </ControlBarColumn>
    );
  }

  render(): ReactElement<any> {
    const { top, left, width } = getElementBox(this.props.targetRef);
    const position = { top, left, width };
    const style = [
      styles.wrapper,
      position,
      this.props.visible && styles.wrapper.visible,
    ];

    return (
      <div style={style}>
        <div style={styles.bar}>
          {this.renderLeftControls()}
          {this.renderMiddleControls()}
          {this.renderRightControls()}
        </div>
      </div>
    );
  }
}

export default withRadium(ControlBar);
