/* @flow */
import type { TreeNode, SpectroState } from 'types/EditorTypes';

/**
 * Creates empty state object
 */
export function createEmpty (): SpectroState {
    return {
        dragAndDrop: null,
        enabled: false,
        plugins: [],
        tree: {},
        target: null,
        onInspect: () => null,
        onChange: () => null
    };
}

/**
 * Creates new object based on existed state
 */
export function createFromObject (data: SpectroState): SpectroState {
    return {
        ...createEmpty(),
        ...data
    };
}

/**
 * Creates new empty state with initial tree object
 */
export function createWithTree (tree: TreeNode): SpectroState {
    return {
        ...createEmpty(),
        tree
    };
}
