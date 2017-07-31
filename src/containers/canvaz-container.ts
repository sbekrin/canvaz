import * as React from 'react';
import { object } from 'prop-types';
import isValidMessage from '~/helpers/is-valid-message';
import rehydrate from '~/tree/rehydrate';
import assignKeys from '~/tree/assign-keys';
import isValidNode from '~/tree/is-valid-node';
import {
  CANVAZ_CONTEXT,
  COMPONENTS_CONTEXT,
  DND_START,
  DND_OVER,
  DND_END,
} from '~/constants';

interface ContainerProps {
  data: CanvazNode;
  onChange?: (newData: CanvazNode) => void;
  edit?: boolean;
  children?: any;
}

interface ContainerState {
  data: CanvazNode;
}

export default class CanvazContainer extends React.Component<
  ContainerProps,
  ContainerState
> {
  static defaultProps = {
    edit: false,
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
    this.state = {
      data: assignKeys(props.data),
    };
  }

  getChildContext() {
    return {
      ...this.context,
      [CANVAZ_CONTEXT]: {
        data: this.state.data,
        editing: this.props.edit,
        setData: this.setData,
      },
    };
  }

  componentDidMount() {
    window.addEventListener('message', this.onMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.onMessage, false);
  }

  onMessage = (event: MessageEvent) => {
    if (!isValidMessage(event)) {
      return;
    }

    switch (event.data.type) {
      case DND_START:
        // Cursor.setGrabbing();
        break;

      case DND_OVER:
        break;

      case DND_END:
        // Cursor.reset();
        break;
    }
  };

  setData = (data: CanvazNode): CanvazNode => {
    if (process.env.NODE_ENV === 'development') {
      if (!isValidNode(data)) {
        throw new TypeError(
          'Invalid data provided to setData. Valid Canvaz node expected.'
        );
      }
    }

    this.setState({ data }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(data);
      }
    });

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
