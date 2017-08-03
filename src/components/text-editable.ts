import * as React from 'react';
import { string } from 'prop-types';
import styled, { css } from 'styled-components';
import withCanvazData, { DataProps } from '~/hocs/with-data';
import dropCanvazProps from '~/helpers/drop-canvaz-props';
import chain from '~/helpers/chain';
import { base, highlighted } from '~/media/component';

interface TextEditableProps {
  onInput?: (event: any) => void;
  id?: string;
  prop?: string;
}

interface TextEditableState {
  edit: boolean;
}

class TextEditable extends React.Component<
  TextEditableProps & DataProps,
  TextEditableState
> {
  static defaultProps = {
    prop: null,
  };

  nodeRef?: HTMLElement = null;
  state = {
    edit: false,
  };

  shouldComponentUpdate(
    nextProps: TextEditableProps & DataProps,
    nextState: TextEditableState
  ) {
    // Exit early if state is different
    if (nextState !== this.state) {
      return true;
    }

    // Exit then no ref exist yet
    if (!this.nodeRef) {
      return this.props !== nextProps;
    }

    // Compare text with current DOM value to avoid caret jumping
    const nextText = nextProps.children.props.children.trim();
    const currentText = this.nodeRef.innerText.trim();
    if (nextText === currentText) {
      // Check rest of props
      return Boolean(
        Object.keys(this.props)
          .filter(prop => prop !== 'children')
          .find(prop => this.props[prop] !== nextProps[prop])
      );
    }

    return true;
  }

  receiveRef = (ref: HTMLElement) => {
    this.nodeRef = ref;
  };

  onMouseOver = chain((event: React.MouseEvent<MouseEvent>) => {
    event.stopPropagation();
  }, this.props.onMouseOver);

  onDragStart = chain((event: React.DragEvent<DragEvent>) => {
    event.stopPropagation();
  }, this.props.onDragStart);

  onDoubleClick = chain((event: React.MouseEvent<MouseEvent>) => {
    this.setState({ edit: true }, () => {
      this.nodeRef.focus();
    });
  }, this.props.onDoubleClick);

  onBlur = chain((event: React.FocusEvent<FocusEvent>) => {
    this.setState({ edit: false });
  }, this.props.onBlur);

  onInput = chain((event: React.KeyboardEvent<KeyboardEvent>) => {
    // Update prop if specified or children by default
    const nextText = (event.target as HTMLElement).innerText;
    const nextNode = this.props.prop
      ? { props: { [this.props.prop]: nextText } }
      : { children: nextText };
    this.props.updateNode(nextNode);
  }, this.props.onInput);

  onKeyDown = chain((event: React.KeyboardEvent<KeyboardEvent>) => {
    if (this.state.edit) {
      // Prevent Backspace / Delete keys to bubble
      switch (event.key) {
        case 'Backspace':
        case 'Delete':
          event.stopPropagation();
          break;
      }
    }
  }, this.props.onKeyDown);

  onKeyPress = chain((event: React.KeyboardEvent<KeyboardEvent>) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.props.duplicateNode();
        break;
    }
  }, this.props.onKeyPress);

  render() {
    const { children, prop, tabIndex = 0, ...props } = this.props;
    const child = React.Children.only(children);

    // Check if this is styled component
    const type = (child as React.ReactElement<any>).type;
    const isStyledComponent = Boolean(
      typeof type === 'function' && (type as any).styledComponentId
    );

    return this.props.isEditing
      ? React.cloneElement(child, {
          ...dropCanvazProps(props),
          tabIndex, // Allow to focus on non-components as well
          [isStyledComponent ? 'innerRef' : 'ref']: this.receiveRef,
          contentEditable: this.state.edit,
          suppressContentEditableWarning: true,
          onMouseOver: this.onMouseOver,
          onDragStart: this.onDragStart,
          onKeyDown: this.onKeyDown,
          onKeyPress: this.onKeyPress,
          onDoubleClick: this.onDoubleClick,
          onBlur: this.onBlur,
          onInput: this.onInput,
        })
      : child;
  }
}

const StyledTextEditable = styled(TextEditable)`
  :hover {
    ${highlighted}
  }

  ${props => props.isEditing && base}
`;

export default withCanvazData<TextEditableProps>(StyledTextEditable);
