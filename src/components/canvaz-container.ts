import * as React from 'react';
import { object } from 'prop-types';
import { CONTEXT_KEY as COMPONENTS_KEY } from '~/components/canvaz-provider';
import rehydrate from '~/tree/rehydrate';
import assignKeys from '~/tree/assign-keys';
import isValidNode from '~/tree/is-valid-node';

export const CONTEXT_KEY = '__canvaz';

interface ContainerProps {
  data: CanvazNode;
  onChange?: (newData: CanvazNode) => void;
  editable?: boolean;
  children?: any;
}

interface ContainerState {
  data: CanvazNode;
  editable: boolean;
}

export default class CanvazContainer extends React.Component<
  ContainerProps,
  ContainerState
> {
  static defaultProps = {
    editable: false,
  };

  static contextTypes = {
    [COMPONENTS_KEY]: object,
  };

  static childContextTypes = {
    [COMPONENTS_KEY]: object.isRequired,
    [CONTEXT_KEY]: object.isRequired,
  };

  constructor(props: ContainerProps, context: {}) {
    super(props, context);
    this.state = {
      data: assignKeys(props.data),
      editable: props.editable,
    };
  }

  getChildContext() {
    return {
      ...this.context,
      [CONTEXT_KEY]: {
        data: this.state.data,
        editable: this.props.editable,
        setData: this.setData,
      },
    };
  }

  setData = (data: CanvazNode) => {
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
  };

  render() {
    if (this.props.children) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          "CanvazContainer does't support children rendering, provide `data` prop instead"
        );
      }
    }

    return rehydrate(this.state.data, this.context[COMPONENTS_KEY], {
      canvazRoot: true,
    });
  }
}
