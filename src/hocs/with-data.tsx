import * as React from 'react';
import { object, string } from 'prop-types';
import hoistStatics = require('hoist-non-react-statics');
import getDisplayName from '~/helpers/get-display-name';
import getRandomKey from '~/helpers/get-random-key';
import * as Tree from '~/tree';
import { CANVAZ_CONTEXT } from '~/constants';

export interface DataProps {
  id?: string;
  isRoot?: boolean;
  isEditing?: boolean;
  getNode: () => CanvazNode;
  updateNode: (data: {}) => CanvazNode;
  removeNode: () => CanvazNode;
  duplicateNode: () => CanvazNode;
  moveNode: () => CanvazNode;
  [key: string]: any;
}

export default function withData<P = {}>(
  WrappedComponent: React.ComponentType<P & DataProps>
): React.ComponentType<P> {
  class WithData extends React.Component<
    P & { id?: string; isRoot?: boolean }
  > {
    static wrappedWithCanvaz = true;
    static displayName = `withData(${getDisplayName(WrappedComponent)})`;
    static WrappedComponent = WrappedComponent;
    static contextTypes = {
      [CANVAZ_CONTEXT]: object,
    };

    getNode = (): CanvazNode => {
      return Tree.getNode(this.context[CANVAZ_CONTEXT].data, this.props.id);
    };

    updateNode = (nextNode: {}): CanvazNode => {
      const canvaz = this.context[CANVAZ_CONTEXT];
      const nextData = Tree.updateNode(canvaz.data, this.props.id, nextNode);
      return canvaz.setData(nextData);
    };

    removeNode = (): CanvazNode => {
      const canvaz = this.context[CANVAZ_CONTEXT];
      const nextData = Tree.removeNode(canvaz.data, this.props.id);
      return canvaz.setData(nextData);
    };

    duplicateNode = (): CanvazNode => {
      const canvaz = this.context[CANVAZ_CONTEXT];
      const currentNode = this.getNode();
      const key = getRandomKey();
      const node = Tree.mergeNodes(currentNode, {
        props: { key, id: key },
        children: '',
      });
      const nextData = Tree.insertNodeAfter(canvaz.data, this.props.id, node);
      return canvaz.setData(nextData);
    };

    moveNode = () => {};

    render() {
      const props = {
        isEditing: this.context[CANVAZ_CONTEXT].editing,
        getNode: this.getNode,
        updateNode: this.updateNode,

        // Add non-root-specific props
        ...!this.props.isRoot && {
          removeNode: this.removeNode,
          duplicateNode: this.duplicateNode,
          moveNode: this.moveNode,
        },
      };

      return <WrappedComponent {...this.props} {...props} />;
    }
  }

  return hoistStatics(WithData, WrappedComponent);
}
