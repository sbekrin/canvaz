/* @flow */
/* eslint-disable no-loop-func */
import uniqWith from 'lodash.uniqwith';
import type { TreeNode, NodeKey } from 'types/EditorTypes';

/**
 * Checks if two nodes has same key
 */
function isSameNode (firstNode: TreeNode, secondNode: TreeNode): boolean {
    return firstNode.props.key === secondNode.props.key;
}

/**
 * Merges two nodes into single one
 */
export function mergeNodes (leftNode: TreeNode, rightNode: TreeNode): TreeNode {
    const children = (
        [ leftNode.props.children, rightNode.props.children ].every(Array.isArray) ?
            uniqWith([ ...leftNode.props.children, ...rightNode.props.children ], isSameNode) :
            rightNode.props.children
    );

    return {
        ...leftNode,
        ...rightNode,
        props: {
            ...leftNode.props,
            ...rightNode.props,
            children
        }
    };
}

/**
 * Returns parent index in `props.children` of node by path
 */
export function getNodeIndex (tree: TreeNode, path: NodeKey[]): number {
    const stack = path.concat().reverse();
    let targetIndex = -1;
    let node = tree;

    stack.pop();

    while (stack.length > 0) {
        const key = stack.pop();

        node = (
            Array.isArray(node.props.children) ?
                node.props.children.find((child: TreeNode, index: number): boolean => {
                    targetIndex = index;
                    return child.props.key === key;
                }) :
                node.props.children
        );
    }

    return targetIndex;
}

/**
 * Returns node object
 */
export function getNode (node: TreeNode, key: string): ?TreeNode {
    const stack: Array<TreeNode> = [ node ];

    while (stack.length > 0) {
        const currentNode: TreeNode = stack.pop();

        if (currentNode.props.key === key) {
            return currentNode;
        }

        if (Array.isArray(currentNode.props.children)) {
            stack.push(...currentNode.props.children);
        }
    }

    return null;
}

/**
 * Returns path of target node by key
 */
export function getNodePath (
    node: TreeNode,
    key: string,
    path: NodeKey[] = []
): ?NodeKey {
    path.push(node.props.key);

    // Return path if node is found
    if (node.props.key === key) {
        return path;
    }

    // Proceed children nodes
    if (Array.isArray(node.props.children)) {
        let foundChildPath: ?NodeKey[] = null;

        node.props.children.every((child: TreeNode): boolean => {
            const childPath: ?NodeKey[] = getNodePath(child, key, path);

            // Keep path and stop iteration
            if (childPath) {
                foundChildPath = childPath;
                return false;
            }

            // Clean up path
            path.pop();
            return true;
        });

        return foundChildPath;
    }

    // If no node were found
    return null;
}

/**
 * Updates node at path
 */
export function updateNodeAtPath (
    tree: TreeNode,
    path: NodeKey[],
    node: TreeNode
): TreeNode {
    const stack = path.concat().reverse();
    let parentNode: ?TreeNode = null;
    let currentNode: TreeNode = tree;
    let targetIndex: number = -1;

    // Skip root element
    stack.pop();

    while (stack.length > 0) {
        const currentKey: string = stack.pop();

        // Keep reference to parent node
        parentNode = currentNode;

        // Move onto next node
        currentNode = (
            Array.isArray(currentNode.props.children) ?
                currentNode.props.children.find((child: TreeNode, index: number): boolean => {
                    if (child.props.key === currentKey) {
                        targetIndex = index;
                        return true;
                    }

                    return false;
                }) :
                currentNode.props.children
        );
    }

    if (!parentNode) {
        return tree;
    }

    // Update reference on parent of target node
    // and remove empty children after
    parentNode.props.children[targetIndex] = node;
    parentNode.props.children = parentNode.props.children.filter(
        (child: TreeNode): boolean => child
    );

    return tree;
}

/**
 * Removes node in tree
 */
export function removeNodeAtPath (tree: TreeNode, path: NodeKey[]): TreeNode {
    return updateNodeAtPath(tree, path, null);
}

/**
 * Returns node by path
 */
export function getNodeAtPath (tree: TreeNode, path: NodeKey[]): TreeNode {
    const stack = path.concat().reverse();
    let node = tree;

    stack.pop();

    while (stack.length > 0) {
        const key = stack.pop();

        node = (
            Array.isArray(node.props.children) ?
                node.props.children.find((child: TreeNode): boolean => (
                    child.props.key === key
                )) :
                node.props.children
        );
    }

    return node;
}

/**
 * Moves node in tree
 */
export function moveNodeAtPath (
    tree: TreeNode,
    targetPath: NodeKey[],
    dropPath: NodeKey[],
    dropIndex: number = 0
): TreeNode {
    const dropStack: NodeKey[] = dropPath.concat().reverse();
    const targetNode: TreeNode = getNodeAtPath(tree, targetPath);
    let parentNode: TreeNode = tree;

    dropStack.pop();

    while (dropStack.length > 0) {
        const key: string = dropStack.pop();

        parentNode = (
            Array.isArray(parentNode.props.children) ?
                parentNode.props.children.find((child: TreeNode): boolean => (
                    child.props.key === key
                )) :
                parentNode.props.children
        );
    }

    if (!parentNode) {
        return tree;
    }

    // Some magic happens here:
    // First, we need to prevent two nodes with same
    // key to appear in tree, so we change old one to
    // add prefix to key, then we move node to new index
    // and finally remove prefixed before node
    const originalKey = targetNode.props.key;
    const markedKey: NodeKey = `__tmp__${originalKey}`;
    const markedPath: NodeKey[] = targetPath.concat();
    const markedNode: TreeNode = mergeNodes(targetNode, { props: { key: markedKey } });

    markedPath.pop();
    markedPath.push(markedKey);

    updateNodeAtPath(tree, targetPath, markedNode);
    parentNode.props.children.splice(dropIndex, 0, targetNode);
    removeNodeAtPath(tree, markedPath);

    return tree;
}
