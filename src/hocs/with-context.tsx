import * as React from 'react';
import { object } from 'prop-types';
import hoistStatics = require('hoist-non-react-statics');
import getDisplayName from '~/helpers/get-display-name';
import { CONTEXT_KEY } from '~/components/canvaz-container';
import { isRootNode, updateNode } from '~/tree';

export interface ContextInjectedProps {
  canvazKey?: string;
  canvazRoot?: boolean;
  canvazEnabled?: boolean;
  setNodeProps?: (newProps: { [key: string]: any }) => void;
  [key: string]: any;
}

const configDefaults: CanvazConfig = {
  controllable: true,
};

/**
 * Compose component with Canvaz props which allows to trigger
 * changes in data tree
 */
export default function withContext<P = {}, S = {}>(): (
  WrappedComponent: React.ComponentType<P & ContextInjectedProps>
) => React.ComponentType<P> {
  return WrappedComponent => {
    const displayName = getDisplayName(WrappedComponent);

    // Set display name to original component if missing
    if (!WrappedComponent.displayName) {
      WrappedComponent.displayName = displayName;
    }

    class WithCanvaz extends React.Component<P & { canvazKey?: string }, S> {
      static displayName = `withCanvaz(${displayName})`;
      static WrappedComponent = WrappedComponent;
      static contextTypes = {
        [CONTEXT_KEY]: object,
      };

      setNodeProps = (nextProps: { [key: string]: any }) => {
        const tree = this.context[CONTEXT_KEY].data;
        const nextData = updateNode(tree, this.props.canvazKey, {
          props: nextProps,
        });
        this.context[CONTEXT_KEY].setData(nextData);
      };

      render() {
        const { editable, data } = this.context[CONTEXT_KEY];
        return (
          <WrappedComponent
            {...this.props}
            canvazEnabled={editable}
            setNodeProps={this.setNodeProps}
          />
        );
      }
    }

    return hoistStatics(WithCanvaz, WrappedComponent);
  };
}
