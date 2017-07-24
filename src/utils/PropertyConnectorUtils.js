import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import type { NodeKey, TreeNode } from 'types/EditorTypes';
import {
  getNodePath,
  getNodeAtPath,
  updateNodeAtPath,
  mergeNodes,
} from '../tree';

type Props = {
  prop: string,
  nodeKey: NodeKey,
};

export function connectProperty(ComposedComponent: constructor) {
  return class PropertyConnector extends Component {
    static contextTypes = {
      spectro: PropTypes.object,
    };

    props: Props;

    constructor(props, context) {
      super(props, context);

      this.onChange = this.onChange.bind(this);
      this.id = `spectro-label-${props.prop}-input`;

      invariant(props.prop, 'Prop name should be provided in `prop`');
      invariant(
        context.spectro,
        'Spectro context should be provided to connect property'
      );
    }

    onChange(event): void {
      const newValue = event.target.value;
      const { spectro } = this.context;
      const { nodeKey, prop } = this.props;
      const path: NodeKey[] = getNodePath(spectro.tree, nodeKey);
      const node: TreeNode = getNodeAtPath(spectro.tree, path);
      const updatedNode: TreeNode = mergeNodes(node, {
        props: {
          [prop]: newValue,
        },
      });

      const newTree = updateNodeAtPath(spectro.tree, path, updatedNode);

      spectro.onChange(newTree);
    }

    render(): ReactElement<any> {
      return <ComposedComponent {...this.props} onChange={this.onChange} />;
    }
  };
}
