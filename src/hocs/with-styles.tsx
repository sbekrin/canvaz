import * as React from 'react';
import styled, { css } from 'styled-components';
import isStatelessComponent from '~/helpers/is-stateless-component';
import convertToClassComponent from '~/helpers/convert-to-class-component';
import dropCanvazProps from '~/helpers/drop-canvaz-props';
import getDisplayName from '~/helpers/get-display-name';
import { EnhanceProps } from '~/hocs/with-enhance';
import { DataProps } from '~/hocs/with-data';

export default function withStyles<P>(
  WrappedComponent
): React.ComponentType<P> {
  // Convert component to class component to being extended
  const ClassComponent: React.ComponentClass<
    P & DataProps & EnhanceProps
  > = isStatelessComponent(WrappedComponent)
    ? convertToClassComponent(WrappedComponent)
    : WrappedComponent;

  // Hack render to inject additional props and add className
  class EnhancedComponent extends ClassComponent {
    static displayName = getDisplayName(WrappedComponent);

    render() {
      const element = super.render();
      if (element) {
        const { className: originalClassNames = '' } = element.props;
        const { enhance, className: injectedClassNames } = this.props;
        return enhance(element, {
          className: `${originalClassNames} ${injectedClassNames}`,
        });
      }
      return element;
    }
  }

  return styled<P & DataProps & EnhanceProps>(EnhancedComponent)`
    // Enable animations
    transition-duration: 100ms;
    transition-property: box-shadow, background-color;

    // Set grab cursor
    [draggable="true"]:active {
      cursor: move;
      cursor: -moz-grabbing;
      cursor: -webkit-grabbing;
    }

    // Highlight component on click
    :focus {
      box-shadow: 0 0 0 2px rgb(59, 153, 252);
      outline: none;
    }

    // Don't let empty components to collapse
    :empty:after {
      color: black;
      font-weight: bold;
      text-transform: lowercase;
      font-variant: small-caps;
      content: '∅ ' attr(aria-label);
      display: flex;
      height: 100%;
      width: 100%;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 0 2px #666;
      font-family: sans-serif;
      opacity: 0.25;
    }

    ${props =>
      props.isVoid &&
      css`
        // Disallow iteractions for empty components
        * {
          pointer-events: none;
        }
      `}

    ${props =>
      props.isHovered &&
      css`
        // Visually show component boundary on hover
        box-shadow: 0 0 0 2px rgba(59, 153, 252, 0.5);
        background-color: rgba(59, 153, 252, 0.1);

        &:not([contenteditable="true"]) {
          cursor: pointer;
        }
    `}
  `;
}
