/* @flow */
import type { NodeKey, EditorDNDState, SpectroConfig } from 'types/EditorTypes';
import { getElementBox } from 'utils/ElementBoxUtils';
import { renderPlaceholder, destroyPlaceholder } from './placeholder';
import {
    getNodePath,
    moveNodeAtPath,
    getNodeIndex } from './tree';

/**
 * Creates new DND state
 */
export function createDndState (instance: Object): ?EditorDNDState {
    const targetPath: ?NodeKey[] = getNodePath(
        instance.context.spectro.tree,
        instance.props.spectroKey
    );

    if (!targetPath) {
        return null;
    }

    return {
        targetPath,
        targetInstance: instance,
        targetRef: instance._childrenRef,
        dropIndex: -1,
        depth: targetPath.length,
        acceptableComponents: [],
        lastDragOverNodeKey: null
    };
}

/**
 * Update DND state on drag over
 */
export function updateDndStateOnOver (
    instance: Object,
    spectro: SpectroConfig,
    event: MouseEvent
): ?EditorDNDState {
    const { tree, dragAndDrop } = instance.context.spectro;
    const {
        targetPath,
        targetInstance,
        lastDragOverNodeKey,
        lastDragOverRef } = dragAndDrop;
    const hasWhiteList: boolean = spectro.accepts && Array.isArray(spectro.accepts);
    const hasChildNodeKey: boolean = lastDragOverNodeKey !== null;
    const targetIsAllowedHere: boolean = (
        hasWhiteList &&
        spectro.accepts.some((type) => (
            type._spectroEnhancer === targetInstance.constructor
        ))
    );
    const isDragOverOnSelf: boolean = (
        targetPath[targetPath.length - 1] === instance.props.spectroKey
    );

    // Do nothing then self-drop
    if (isDragOverOnSelf) {
        console.log('dos');
        return dragAndDrop;
    }

    // Once drag event reaches spectro component with
    // white-list prop `accepts`, keep that list for
    // next check "if element is allowed here"
    if (targetIsAllowedHere && hasChildNodeKey) {
        event.stopPropagation();
        const childNodePath: ?NodeKey[] = getNodePath(tree, lastDragOverNodeKey);
        const dropPath: ?NodeKey[] = getNodePath(tree, instance.props.spectroKey);
        const acceptableComponents = spectro.accepts;
        const { top, left, height, width } = getElementBox(lastDragOverRef);

        // Prevent DND if target or dropzone are empty
        if (!childNodePath || !dropPath) {
            return dragAndDrop;
        }

        let dropIndex: number = getNodeIndex(tree, childNodePath);
        let willDropAfter: boolean = false;

        // Negative drop index may happen on root component
        if (dropIndex < 0) {
            return dragAndDrop;
        }

        // Increase drop index to move element after target
        if (event.pageY > (top + (height / 2))) {
            willDropAfter = true;
            dropIndex += 1;
        }

        renderPlaceholder(left, top + (willDropAfter ? height : 0), width);

        return {
            ...dragAndDrop,
            dropPath,
            dropIndex,
            acceptableComponents
        };
    }

    return {
        ...dragAndDrop,
        lastDragOverNodeKey: instance.props.spectroKey,
        lastDragOverRef: instance._childrenRef
    };
}

/**
 * Update DND state on drop
 */
export function updateDndStateOnDrop (instance: Object, event: MouseEvent): EditorDNDState {
    const { tree, dragAndDrop, onChange } = instance.context.spectro;
    const { targetPath, targetInstance, dropPath, dropIndex } = dragAndDrop;

    const newDndState = {
        ...dragAndDrop,
        depth: dragAndDrop.depth - 1
    };

    const isDropOnSelf: boolean = (
        targetPath[targetPath.length - 1] === instance.props.spectroKey
    );
    const hasWhiteList: boolean = newDndState.acceptableComponents.length > 0;
    const hasAchievedRoot: boolean = newDndState.depth <= 1;
    const isAllowedHere: boolean = newDndState.acceptableComponents.some((type) => (
        type._spectroEnhancer === targetInstance.constructor
    ));

    // Proceed drop
    if (isAllowedHere && hasWhiteList && !isDropOnSelf) {
        onChange(moveNodeAtPath(tree, targetPath, dropPath, dropIndex));
    }

    destroyPlaceholder();

    // Stop event from bubbling up
    if (isAllowedHere || isDropOnSelf || hasAchievedRoot) {
        event.stopPropagation();
        targetInstance.onDragEnd();
        return null;
    }

    return newDndState;
}
