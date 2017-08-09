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
  getDndDragNode: () => CanvazNode;
  getDndTargetNode: () => CanvazNode;
  getDndDropIndex: () => number;
  updateNode: (data: {}) => CanvazNode;
  removeNode: () => CanvazNode;
  duplicateNode: () => CanvazNode;
  moveNodeAfter: (after: string) => CanvazNode;
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

    getIndex = (): number => {
      return Tree.getNodeIndex(
        this.context[CANVAZ_CONTEXT].data,
        this.props.id
      );
    };

    getNode = (): CanvazNode => {
      return Tree.getNode(this.context[CANVAZ_CONTEXT].data, this.props.id);
    };

    getDndDragNode = (): CanvazNode => {
      const canvaz = this.context[CANVAZ_CONTEXT];
      return Tree.getNode(canvaz.data, canvaz.dndDraggedKey);
    };

    getDndTargetNode = (): CanvazNode => {
      const canvaz = this.context[CANVAZ_CONTEXT];
      return Tree.getNode(canvaz.data, canvaz.dndTargetKey);
    };

    getDndDropIndex = (): number => {
      return this.context[CANVAZ_CONTEXT].dndDropIndex;
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

    insertNodeAt = (node: CanvazNode, index: number = 0) => {
      const canvaz = this.context[CANVAZ_CONTEXT];
      const cleanedData = Tree.removeNode(canvaz.data, node.props.id);
      const key = this.props.id;
      const nextData = Tree.insertNodeAtIndex(cleanedData, key, node, index);
      return canvaz.setData(nextData);
    };

    render() {
      const props = {
        isEditing: this.context[CANVAZ_CONTEXT].editing,
        getIndex: this.getIndex,
        getNode: this.getNode,
        getDndTargetNode: this.getDndTargetNode,
        getDndDragNode: this.getDndDragNode,
        getDndDropIndex: this.getDndDropIndex,
        updateNode: this.updateNode,
        insertNodeAt: this.insertNodeAt,

        // Add non-root-specific props
        ...!this.props.isRoot && {
          removeNode: this.removeNode,
          duplicateNode: this.duplicateNode,
        },
      };

      return <WrappedComponent {...this.props} {...props} />;
    }
  }

  return hoistStatics(WithData, WrappedComponent);
}
