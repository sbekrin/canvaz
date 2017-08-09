import * as React from 'react';
import { object } from 'prop-types';
import isValidMessage from '~/helpers/is-valid-message';
import rehydrate from '~/tree/rehydrate';
import assignKeys from '~/tree/assign-keys';
import isValidNode from '~/tree/is-valid-node';
import History from '~/models/history';
import { HISTORY_CONTAINER } from '~/constants';
import {
  CANVAZ_CONTEXT,
  COMPONENTS_CONTEXT,
  DND_START,
  DND_OVER,
  DND_END,
  noop,
} from '~/constants';

interface ContainerProps {
  data: CanvazNode;
  onChange?: (newData: CanvazNode) => void;
  edit?: boolean;
  history?: boolean;
  children?: any;
}

interface ContainerState {
  data: CanvazNode;
  history: History<CanvazNode>;
}

export default class CanvazContainer extends React.Component<
  ContainerProps,
  ContainerState
> {
  static defaultProps = {
    edit: false,
    history: true,
    setData: noop,
  };

  static contextTypes = {
    [COMPONENTS_CONTEXT]: object,
  };

  static childContextTypes = {
    [COMPONENTS_CONTEXT]: object.isRequired,
    [CANVAZ_CONTEXT]: object.isRequired,
  };

  constructor(props: ContainerProps, context: {}) {
    super(props, context);
    const data = assignKeys(props.data);
    this.state = { data, history: new History([data]) };
  }

  getChildContext() {
    return {
      ...this.context,
      [CANVAZ_CONTEXT]: {
        data: this.state.data,
        editing: this.props.edit,
        setData: this.setData,
        undo: this.undo,
        redo: this.redo,
      },
    };
  }

  componentDidMount() {
    if (global[HISTORY_CONTAINER]) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          'Canvaz: Keyboard control is disabled because another container already registered it.'
        );
      }
      return;
    }

    window.addEventListener('message', this.onMessage, false);
    window.addEventListener('keydown', this.onKeyDown, false);
    global[HISTORY_CONTAINER] = this;
  }

  componentWillUnmount() {
    if (global[HISTORY_CONTAINER] === this) {
      window.removeEventListener('message', this.onMessage, false);
      window.removeEventListener('keydown', this.onKeyDown, false);
      delete global[HISTORY_CONTAINER];
    }
  }

  onMessage = (event: MessageEvent) => {
    if (!isValidMessage(event)) return;

    switch (event.data.type) {
      case DND_START:
        break;

      case DND_OVER:
        break;

      case DND_END:
        break;
    }
  };

  onKeyDown = (event: KeyboardEvent) => {
    const isZKey = event.keyCode === 90;
    const isYKey = event.keyCode === 89;
    const isMacUndo = event.metaKey && isZKey;
    const isWinUndo = event.ctrlKey && isZKey;
    const isMacRedo = event.shiftKey && event.metaKey && isZKey;
    const isWinRedo = event.ctrlKey && isYKey;

    if (isMacRedo || isWinRedo) {
      this.redo();
    } else if (isMacUndo || isWinUndo) {
      this.undo();
    }
  };

  // Trigger callback with latest data
  notifyDataChange = () => {
    this.props.onChange(this.state.data);
  };

  // Check if history is eanbled and if can go back
  undo = () => {
    if (this.props.history && this.state.history.backward()) {
      this.setDataUnsafe(this.state.history.getCurrent());
    }
  };

  // Check if history is enabled and if can go forward
  redo = () => {
    if (this.props.history && this.state.history.forward()) {
      this.setDataUnsafe(this.state.history.getCurrent());
    }
  };

  // Sets data without node check and no history register
  setDataUnsafe = (data: CanvazNode): CanvazNode => {
    this.setState({ data }, this.notifyDataChange);
    return data;
  };

  setData = (data: CanvazNode): CanvazNode => {
    if (process.env.NODE_ENV === 'development') {
      if (!isValidNode(data)) {
        throw new TypeError(
          'Invalid data provided to setData. Valid Canvaz node expected.'
        );
      }
    }

    // Keep change in history if enabled
    if (this.props.history) {
      this.state.history.push(data);
    }

    this.setState(
      { data: this.state.history.getCurrent() },
      this.notifyDataChange
    );

    return data;
  };

  render() {
    if (this.props.children) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          "CanvazContainer does't support children rendering, provide `data` prop instead"
        );
      }
    }

    return rehydrate(this.state.data, this.context[COMPONENTS_CONTEXT], {
      isRoot: true,
    });
  }
}
