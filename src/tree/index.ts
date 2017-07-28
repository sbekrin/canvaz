/** Finds node in tree by its key */
export function getNode(tree: CanvazNode, key: string) {
  const traverse = (node: CanvazNode): CanvazNode | void => {
    // Return current node if found
    if (node.props.key === key) {
      return node;
    }

    // Iterate through children
    if (Array.isArray(node.props.children)) {
      return node.props.children.map(traverse).find(Boolean);
    }

    return null;
  };

  return traverse(tree);
}

export function replaceNode(
  tree: CanvazNode,
  key: string,
  newNode: CanvazNode
) {
  const traverse = (node: CanvazNode): CanvazNode => {
    // Repalce node if found
    if (node.props.key === key) {
      return newNode;
    }

    // Iterate through children
    if (Array.isArray(node.props.children)) {
      return mergeNodes(node, {
        props: node.props.children.map(traverse),
      });
    }

    return node;
  };

  return traverse(tree);
}

export function mergeNodes(
  leftNode: { type?: string; props?: { [key: string]: any } },
  rightNode: { type?: string; props?: { [key: string]: any } }
): CanvazNode {
  return {
    type: rightNode.type || leftNode.type,
    props: {
      ...leftNode.props || {},
      ...rightNode.props || {},
    },
  };
}

export function updateNode(
  tree: CanvazNode,
  key: string,
  nextNode: { type?: string; props?: { [key: string]: any } }
) {
  const prevNode = getNode(tree, key);
  if (!prevNode) {
    throw new Error(`No Node found with such id: ${key}`);
  }
  return replaceNode(tree, key, mergeNodes(prevNode, nextNode));
}

export function removeNode(tree: CanvazNode, key: string) {
  return replaceNode(tree, key, null);
}

export function isRootNode(tree: CanvazNode, key: string) {
  return tree.props.key === key;
}
