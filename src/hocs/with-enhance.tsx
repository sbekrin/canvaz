import * as React from 'react';
import { object, string } from 'prop-types';
import hoistStatics = require('hoist-non-react-statics');
import styled, { css } from 'styled-components';
import CanvazContainer from '~/containers/canvaz-container';
import convertToClassComponent from '~/helpers/convert-to-class-component';
import getDisplayName from '~/helpers/get-display-name';
import chain from '~/helpers/chain';
import withData, { DataProps } from '~/hocs/with-data';
import { DND_START, DND_OVER, DND_END } from '~/constants';

const configDefaults: CanvazConfig = {
  accept: {},
  void: false,
};

export interface EnhanceProps {
  void: boolean;
  hovered: boolean;
  selected: boolean;
  enhance: (
    element: React.ReactElement<any>,
    overrides?: {}
  ) => React.ReactElement<any>;
  [key: string]: any;
}

interface CanvazState {
  hovered: boolean;
  selected: boolean;
  grabbed: boolean;
  droppable: boolean;
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
      static WrappedComponent = WrappedComponent;
      static canvaz = config;

      state = {
        hovered: false,
        selected: false,
        grabbed: false,
        droppable: false,
      };

      onDragStart = (event: React.DragEvent<DragEvent>) => {
        event.stopPropagation();
        event.dataTransfer.setData('text/plain', this.props.children as string);
        event.dataTransfer.effectAllowed = 'move';
        CanvazContainer.createPlaceholder(this);
        CanvazContainer.broadcast(DND_START, { key: this.props.id });
        this.setState({ grabbed: true });
      };

      onDragEnter = (event: React.DragEvent<DragEvent>) => {
        event.preventDefault();

        // Check if dragged element can be drop in there
        const droppable = this.props.canDrop();
        this.setState({ droppable, hovered: false });
        if (droppable) {
          event.stopPropagation();
          event.dataTransfer.dropEffect = 'move';
          return;
        }

        // Update placeholder on last drag overed node
        CanvazContainer.broadcast(DND_OVER, {
          index: this.props.getIndex(),
          key: this.props.id,
        });
      };

      onDragOver = (event: React.DragEvent<DragEvent>) => {
        event.preventDefault();

        // Display placeholder
        // TODO: Display placeholder in actual allowed place to drop
        if (this.state.droppable) {
          const box = (event.target as HTMLElement).getBoundingClientRect();
          const width = Math.floor(box.width);
          const height = Math.floor(box.height);
          const top = Math.floor(box.top + window.scrollY);
          const left = Math.floor(box.left + window.scrollX);
          const shouldDropAfter = event.pageY - height / 2 > top;
          const calculatedTop = top + (shouldDropAfter ? height : 0);
          CanvazContainer.movePlaceholder(calculatedTop, left, width);
        }
      };

      onDragEnd = (event: React.DragEvent<DragEvent>) => {
        CanvazContainer.destroyPlaceholder();
        CanvazContainer.broadcast(DND_END, { key: this.props.id });
        this.setState({ grabbed: false });
      };

      onDrop = (event: React.DragEvent<DragEvent>) => {
        event.preventDefault();
        if (this.state.droppable) {
          event.stopPropagation();
          this.props.proceedDrop();
          CanvazContainer.destroyPlaceholder();
        }
      };

      onMouseOver = (event: React.MouseEvent<MouseEvent>) => {
        event.stopPropagation();
        this.setState({ hovered: true });
      };

      onMouseOut = (event: React.MouseEvent<MouseEvent>) => {
        this.setState({ hovered: false });
      };

      onKeyDown = (event: React.KeyboardEvent<KeyboardEvent>) => {
        // Delete node on delete or backspace
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

        const ariaProps = {
          'aria-label': config.label,
          'aria-dropeffect': 'move',
          'aria-grabbed': this.state.grabbed.toString(),
        };

        return React.cloneElement(element, {
          ...overrides,
          ...ariaProps,
          tabIndex: this.props.tabIndex || 0,
          onMouseOver: this.onMouseOver,
          onMouseOut: this.onMouseOut,
          onDragEnter: this.onDragEnter,
          onDragOver: this.onDragOver,
          onDragEnd: this.onDragEnd,
          onDrop: this.onDrop,

          // Apply non-root-specific props
          ...!this.props.isRoot && {
            draggable: true,
            onDragStart: this.onDragStart,
            onKeyDown: this.onKeyDown,
          },
        });
      };

      render() {
        const propsForStyling = {
          void: config.void,
          hovered: this.state.hovered,
          selected: this.state.selected,
          grabbed: this.state.grabbed,
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
