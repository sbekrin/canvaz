import * as React from 'react';
import { object, string } from 'prop-types';
import hoistStatics = require('hoist-non-react-statics');
import styled, { css } from 'styled-components';
import broadcastMessage from '~/helpers/broadcast-message';
import getDisplayName from '~/helpers/get-display-name';
import convertToClassComponent from '~/helpers/convert-to-class-component';
import withData, { DataProps } from '~/hocs/with-data';
import { DND_START, DND_OVER, DND_END } from '~/constants';

const DATA_FORMAT = 'text/x-canvaz=key';

const configDefaults: CanvazConfig = {
  accept: [],
  void: false,
};

export interface EnhanceProps {
  isVoid: boolean;
  isHovered: boolean;
  isSelected: boolean;
  enhance: (
    element: React.ReactElement<any>,
    overrides?: {}
  ) => React.ReactElement<any>;
  [key: string]: any;
}

interface CanvazState {
  hovered: boolean;
  selected: boolean;
}

export default function enhanceWithCanvaz<P = {}>(
  userConfig: CanvazConfig = {}
): (
  WrappedComponent: React.ComponentType<P & DataProps & EnhanceProps>
) => React.ComponentType<P> {
  const config = { ...configDefaults, ...userConfig };
  return WrappedComponent => {
    const displayName = getDisplayName(WrappedComponent);
    class WithEnhance extends React.Component<
      P & DataProps & EnhanceProps,
      CanvazState
    > {
      static displayName = `withCanvaz(${displayName})`;
      static canvazConfig = config;
      static WrappedComponent = WrappedComponent;

      state = {
        hovered: false,
        selected: false,
      };

      onDragStart = (event: React.DragEvent<DragEvent>) => {
        event.stopPropagation();
        event.dataTransfer.setData('text/plain', this.props.children as string);
        event.dataTransfer.setData(DATA_FORMAT, this.props.id);
        event.dataTransfer.effectAllowed = 'move';
        broadcastMessage(DND_START, { id: this.props.id });
      };

      onDragOver = (event: React.DragEvent<DragEvent>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        broadcastMessage(DND_OVER, { id: this.props.id });
      };

      onDragEnd = (event: React.DragEvent<DragEvent>) => {
        broadcastMessage(DND_END, { id: this.props.id });
      };

      onDrop = (event: React.DragEvent<DragEvent>) => {
        event.preventDefault();
      };

      onMouseOver = (event: React.MouseEvent<MouseEvent>) => {
        event.stopPropagation();
        this.setState({ hovered: true });
      };

      onMouseOut = (event: React.MouseEvent<MouseEvent>) => {
        this.setState({ hovered: false });
      };

      onKeyDown = (event: React.KeyboardEvent<KeyboardEvent>) => {
        if (this.props.isRoot) {
          return;
        }

        switch (event.keyCode) {
          case 46: // Delete
          case 8: // Backspace
            event.stopPropagation();
            this.props.removeNode();
            break;
        }
      };

      enhance = (element: React.ReactElement<any>, overrides: {} = {}) => {
        // Do nothing if in view mode
        if (!this.props.isEditing) {
          return element;
        }

        return React.cloneElement(element, {
          ...overrides,
          tabIndex: this.props.tabIndex || 0,
          draggable: !this.props.isRoot,
          onMouseOver: this.onMouseOver,
          onMouseOut: this.onMouseOut,
          onDragStart: this.onDragStart,
          onDragOver: this.onDragOver,
          onDragEnd: this.onDragEnd,
          onDrop: this.onDrop,
          onKeyDown: this.onKeyDown,
        });
      };

      render() {
        const propsForStyling = {
          isVoid: config.void,
          isHovered: this.state.hovered,
          isSelected: this.state.selected,
        };

        return (
          <WrappedComponent
            {...this.props}
            {...propsForStyling}
            enhance={this.enhance}
          />
        );
      }
    }

    return hoistStatics(WithEnhance, WrappedComponent);
  };
}
