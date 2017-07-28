import * as React from 'react';
import styled, { css } from 'styled-components';
import withContext, { ContextInjectedProps } from '~/hocs/with-context';

const ENTER_KEY_CODE = 13;

interface TextEditableProps {
  onInput?: (event: any) => void;
  canvazKey?: string;
  prop?: string;
}

class TextEditable extends React.Component<
  TextEditableProps & ContextInjectedProps
> {
  static defaultProps = {
    prop: 'children',
  };

  nodeRef?: HTMLElement = null;
  state = {
    editable: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const hasNewState = nextState !== this.state;
    const nextText = nextProps.children.props.children;
    const currentText = this.nodeRef.innerText;
    return hasNewState || nextText.trim() !== currentText.trim();
  }

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
    this.props.setNodeProps({
      [this.props.prop]: (event.target as HTMLElement).innerText,
    });
  };

  onKeyPress = (event: React.KeyboardEvent<KeyboardEvent>) => {
    if (event.which === ENTER_KEY_CODE) {
      event.preventDefault();
    }
  };

  render() {
    const {
      canvazKey,
      canvazRoot,
      canvazEnabled,
      setNodeProps,
      children,
      tabIndex = 0,
      prop,
      ...props,
    } = this.props;
    const child = React.Children.only(children);

    // Check if this is styled component
    const type = (child as React.ReactElement<any>).type;
    const isStyledComponent = Boolean(
      typeof type === 'function' && (type as any).styledComponentId
    );

    return canvazEnabled
      ? React.cloneElement(child, {
          ...props,
          [isStyledComponent ? 'innerRef' : 'ref']: this.keepRef,
          tabIndex,
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
    props.canvazEnabled &&
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

export default withContext<TextEditableProps>()(StyledTextEditable);
