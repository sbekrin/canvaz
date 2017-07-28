import * as React from 'react';
import { object } from 'prop-types';

export const CONTEXT_KEY = '__components';

interface ProviderProps {
  children: any;
  components: {
    [key: string]: React.ComponentType<any>;
  };
}

export default class CanvazProvider extends React.Component<ProviderProps> {
  static contextTypes = {
    [CONTEXT_KEY]: object,
  };

  static childContextTypes = {
    [CONTEXT_KEY]: object.isRequired,
  };

  getChildContext() {
    return {
      ...this.context,
      [CONTEXT_KEY]: this.props.components,
    };
  }

  render() {
    // <CanvazProvider /> should have only one or no child at all
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}
