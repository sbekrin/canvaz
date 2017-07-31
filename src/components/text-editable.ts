import * as React from 'react';
import { string } from 'prop-types';
import styled, { css } from 'styled-components';
import withCanvazData, { DataProps } from '~/hocs/with-data';
import dropCanvazProps from '~/helpers/drop-canvaz-props';

interface TextEditableProps {
  onInput?: (event: any) => void;
  id?: string;
  prop?: string;
}

class TextEditable extends React.Component<TextEditableProps & DataProps> {
  static defaultProps = {
    prop: null,
  };

  nodeRef?: HTMLElement = null;
  state = {
    editable: false,
  };

  keepRef = (ref: HTMLElement) => {
    this.nodeRef = ref;
  };

  onDoubleClick = event => {
    this.setState({ editable: true }, () => {
      this.nodeRef.focus();
    });
  };

  onBlur = (event: React.FocusEvent<FocusEvent>) => {
    this.setState({ editable: false });
  };

  onInput = (event: React.KeyboardEvent<KeyboardEvent>) => {
    // Update prop if specified or children by default
    const nextText = (event.target as HTMLElement).innerText;
    const nextNode = this.props.prop
      ? { props: { [this.props.prop]: nextText } }
      : { children: nextText };
    this.props.updateNode(nextNode);
  };

  onKeyPress = (event: React.KeyboardEvent<KeyboardEvent>) => {
    switch (event.keyCode) {
      case 13: // Enter
        // TODO: Clone node after current
        event.preventDefault();
        break;
    }
  };

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
          [isStyledComponent ? 'innerRef' : 'ref']: this.keepRef,
          onKeyPress: this.onKeyPress,
          onDoubleClick: this.onDoubleClick,
          onBlur: this.onBlur,
          onInput: this.onInput,
          contentEditable: this.state.editable,
          suppressContentEditableWarning: true,
        })
      : child;
  }
}

const StyledTextEditable = styled(TextEditable)`
  ${props =>
    props.isEditing &&
    css`
      transition-duration: 100ms;
      transition-property: box-shadow; 

      :hover {
        box-shadow: 0 0 0 2px rgba(59, 153, 252, 0.5);
      }

      :focus {
        box-shadow: 0 0 0 2px rgb(59, 153, 252);
        outline: none;
      }
  `}
`;

export default withCanvazData<TextEditableProps>(StyledTextEditable);
