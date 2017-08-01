/** Checks if node is root node */
export function isRootNode(tree: CanvazNode, key: string) {
  return tree.props.key === key;
}

/** Finds node in tree by its key */
export function getNode(tree: CanvazNode, key: string) {
  const traverse = (node: CanvazNode): CanvazNode => {
    // Return current node if found
    if (node.props.key === key) {
      return node;
    }

    // Iterate through children
    if (Array.isArray(node.children)) {
      return node.children.map(traverse).find(Boolean);
    }

    return null;
  };

  return traverse(tree);
}

/** Returns index of node relative to parent's children array */
export function getNodeIndex(tree: CanvazNode, key: string): number {
  // Check root node
  if (tree.props.key === key) {
    return 0;
  }

  const traverse = (node: CanvazNode): number => {
    if (Array.isArray(node.children)) {
      const index = node.children.findIndex(child => child.props.key === key);

      // If found
      if (index > -1) {
        return index;
      }

      // Iterate children if not yet found
      return node.children.map(traverse).find(index => index > -1);
    }

    return -1;
  };

  return traverse(tree);
}

/** Replaces node with new one */
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
    if (Array.isArray(node.children)) {
      return mergeNodes(node, {
        children: node.children.map(traverse).filter(Boolean),
      });
    }

    return node;
  };

  return traverse(tree);
}

/** Merges two nodes into one */
export function mergeNodes(
  leftNode: {
    type?: string;
    props?: { [key: string]: any };
    children?: CanvazNode[] | string | number;
  },
  rightNode: {
    type?: string;
    props?: { [key: string]: any };
    children?: CanvazNode[] | string | number;
  }
): CanvazNode {
  const type = rightNode.type || leftNode.type;
  const props = { ...leftNode.props || {}, ...rightNode.props || {} };
  const children =
    rightNode.children === undefined ? leftNode.children : rightNode.children;
  return { type, props, children };
}

/** Updates node with new data */
export function updateNode(
  tree: CanvazNode,
  key: string,
  nextNode: {
    type?: string;
    props?: { [key: string]: any };
    children?: CanvazNode[] | string | number;
  }
) {
  const prevNode = getNode(tree, key);
  if (!prevNode) {
    throw new Error(`No Node found with such id: ${key}`);
  }
  return replaceNode(tree, key, mergeNodes(prevNode, nextNode));
}

/** Removes node from tree */
export function removeNode(tree: CanvazNode, key: string) {
  return replaceNode(tree, key, null);
}

/** Inserts node inside node with target key at specific index */
export function insertNode(
  tree: CanvazNode,
  key: string,
  nodeToInsert: CanvazNode,
  index: number = -1
) {
  const traverse = (node: CanvazNode): CanvazNode => {
    if (Array.isArray(node.children)) {
      const children = node.children;
      const hasChild = Boolean(children.find(({ props }) => props.key === key));

      // Immutably modify children
      if (hasChild) {
        return mergeNodes(node, {
          children: [
            ...children.slice(0, index),
            nodeToInsert,
            ...children.slice(index, children.length),
          ],
        });
      }

      return mergeNodes(node, {
        children: node.children.map(traverse),
      });
    }

    return node;
  };

  return traverse(tree);
}

/** Insert node at specific position of node with provided key */
export function insertNodeAtIndex(
  tree: CanvazNode,
  key: string,
  node: CanvazNode,
  index: number
) {
  const targetNode = getNode(tree, key);
  if (targetNode) {
    return insertNode(tree, key, node, index);
  }
  return tree;
}

/** Insert node before one with provided key */
export function insertNodeBefore(
  tree: CanvazNode,
  key: string,
  node: CanvazNode
) {
  return insertNodeAtIndex(tree, key, node, getNodeIndex(tree, key) - 1);
}

/** Insert node after one with provided key */
export function insertNodeAfter(
  tree: CanvazNode,
  key: string,
  node: CanvazNode
) {
  return insertNodeAtIndex(tree, key, node, getNodeIndex(tree, key) + 1);
}
