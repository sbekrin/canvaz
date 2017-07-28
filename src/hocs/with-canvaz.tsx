import * as React from 'react';
import { object } from 'prop-types';
import hoistStatics = require('hoist-non-react-statics');
import styled, { css } from 'styled-components';
import getDisplayName from '~/helpers/get-display-name';
import convertToClassComponent from '~/helpers/convert-to-class-component';
import { CONTEXT_KEY } from '~/components/canvaz-container';
import withContext, { ContextInjectedProps } from '~/hocs/with-context';

const configDefaults: CanvazConfig = {
  controllable: true,
};

export default function withCanvaz<P = {}, S = {}>(
  userConfig: CanvazConfig = {}
): (WrappedComponent: React.ComponentType<P>) => React.ComponentType<P> {
  const config = { ...configDefaults, userConfig };

  return WrappedComponent => {
    const ClassComponent = convertToClassComponent<P & ContextInjectedProps>(
      WrappedComponent
    );

    class CanvazEnhancer extends ClassComponent {
      static isCanvasEnhanced = true;
      static EnhancedComponent = ClassComponent;

      onDragStart = (event: React.DragEvent<DragEvent>) => {
        event.stopPropagation();
      };

      onDragEnd = (event: React.DragEvent<DragEvent>) => {};

      onDrop = (event: React.DragEvent<DragEvent>) => {};

      render() {
        const renderedElement = super.render();
        const { children, ...props } = this.props as any;

        // Extend component with control events when Canvaz is enabled,
        // elements renders to something and if this is not top-level
        // component
        if (
          this.props.canvazEnabled &&
          renderedElement &&
          !this.props.canvazRoot
        ) {
          return React.cloneElement(renderedElement, {
            ...props,
            draggable: !this.props.canvazRoot,
            onDragStart: this.onDragStart,
            onDragEnd: this.onDragEnd,
            onDrop: this.onDrop,
          });
        }

        return renderedElement;
      }
    }

    const StyledCanvazEnhancer = styled(CanvazEnhancer)`
      ${props =>
        props.canvazEnabled &&
        css`
          transition-duration: 100ms;
          transition-property: box-shadow, background-color; 

          :hover {
            box-shadow: 0 0 0 2px rgba(59, 153, 252, 0.5);
            background-color: rgba(59, 153, 252, 0.1);

            &:not([contenteditable="true"]) {
              cursor: pointer;
            }
          }

          :focus {
            box-shadow: 0 0 0 2px rgb(59, 153, 252);
            outline: none;
          }
      `}
    `;

    return withContext<P, S>()(StyledCanvazEnhancer);
  };
}
