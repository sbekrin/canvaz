import * as React from 'react';
import { object } from 'prop-types';
import { COMPONENTS_CONTEXT } from '~/constants';

interface ProviderProps {
  children: any;
  components: {
    [key: string]: React.ComponentType<any>;
  };
}

export default class RehydrationProvider extends React.Component<
  ProviderProps
> {
  static childContextTypes = {
    [COMPONENTS_CONTEXT]: object.isRequired,
  };

  getChildContext() {
    return {
      ...this.context,
      [COMPONENTS_CONTEXT]: this.props.components,
    };
  }

  render() {
    // <CanvazProvider /> should have only one or no child at all
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}
