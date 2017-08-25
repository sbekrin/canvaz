import * as React from 'react';
import styled, { css } from 'styled-components';
import isStatelessComponent from '~/helpers/is-stateless-component';
import convertToClassComponent from '~/helpers/convert-to-class-component';
import dropCanvazProps from '~/helpers/drop-canvaz-props';
import getDisplayName from '~/helpers/get-display-name';
import { EnhanceProps } from '~/hocs/with-enhance';
import { DataProps } from '~/hocs/with-data';
import { base, voided, hovered, grabbed } from '~/media/component';

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
          className: [originalClassNames, injectedClassNames].join(' '),
        });
      }

      return element;
    }
  }

  return styled<P & DataProps & EnhanceProps>(EnhancedComponent)`
    // Set grab cursor for non-editable components
    [draggable="true"]:not([contenteditable="true"]):active {
      cursor: move;
      cursor: -moz-grabbing;
      cursor: -webkit-grabbing;
    }

    ${base}
    ${props => props.hovered && hovered}
    ${props => props.void && voided}
    ${props => props.grabbed && grabbed}
    ${props => props.droppable && droppable}
  `;
}
