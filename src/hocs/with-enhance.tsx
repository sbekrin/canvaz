import * as React from 'react';
import { object, string } from 'prop-types';
import hoistStatics = require('hoist-non-react-statics');
import styled, { css } from 'styled-components';
import convertToClassComponent from '~/helpers/convert-to-class-component';
import broadcastMessage from '~/helpers/broadcast-message';
import getDisplayName from '~/helpers/get-display-name';
import chain from '~/helpers/chain';
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
        if (event.isPropagationStopped()) return;
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
        if (event.isPropagationStopped()) return;
        event.stopPropagation();
        this.setState({ hovered: true });
      };

      onMouseOut = (event: React.MouseEvent<MouseEvent>) => {
        this.setState({ hovered: false });
      };

      onKeyDown = (event: React.KeyboardEvent<KeyboardEvent>) => {
        if (event.isPropagationStopped()) return;

        switch (event.key) {
          case 'Delete':
          case 'Backspace':
            event.stopPropagation();
            this.props.removeNode();
            break;
        }
      };

      enhance = (element: React.ReactElement<any>, overrides: {} = {}) => {
        // Do nothing if in view mode
        if (!this.props.isEditing) return element;

        return React.cloneElement(element, {
          ...overrides,
          'aria-label': element.props['aria-label'] || config.label,
          tabIndex: this.props.tabIndex || 0,
          onMouseOver: this.onMouseOver,
          onMouseOut: this.onMouseOut,
          onDragOver: this.onDragOver,
          onDrop: this.onDrop,

          // Apply non-root-specific props
          ...!this.props.isRoot && {
            draggable: true,
            onDragStart: this.onDragStart,
            onDragEnd: this.onDragEnd,
            onKeyDown: this.onKeyDown,
          },
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
