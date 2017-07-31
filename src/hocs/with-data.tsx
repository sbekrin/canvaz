import * as React from 'react';
import { object, string } from 'prop-types';
import hoistStatics = require('hoist-non-react-statics');
import getDisplayName from '~/helpers/get-display-name';
import { updateNode, removeNode } from '~/tree';
import { CANVAZ_CONTEXT } from '~/constants';

export interface DataProps {
  id?: string;
  isEditing?: boolean;
  updateNode: ({}) => CanvazNode;
  removeNode: () => CanvazNode;
  [key: string]: any;
}

export default function withData<P = {}>(
  WrappedComponent: React.ComponentType<P & DataProps>
): React.ComponentType<P> {
  class WithData extends React.Component<P & { id?: string }> {
    static wrappedWithCanvaz = true;
    static displayName = `withData(${getDisplayName(WrappedComponent)})`;
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      [CANVAZ_CONTEXT]: object,
    };

    updateNode = (nextNode: {}): CanvazNode => {
      const canvaz = this.context[CANVAZ_CONTEXT];
      const nextData = updateNode(canvaz.data, this.props.id, nextNode);
      return canvaz.setData(nextData);
    };

    removeNode = (): CanvazNode => {
      const canvaz = this.context[CANVAZ_CONTEXT];
      const nextData = removeNode(canvaz.data, this.props.id);
      return canvaz.setData(nextData);
    };

    render() {
      const { editing, data } = this.context[CANVAZ_CONTEXT];
      return (
        <WrappedComponent
          {...this.props}
          isEditing={editing}
          updateNode={this.updateNode}
          removeNode={this.removeNode}
        />
      );
    }
  }

  return hoistStatics(WithData, WrappedComponent);
}
