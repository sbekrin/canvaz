import type { Component } from 'react';

export type NodeKey = string;

export type TreeNode = {
    type: string,
    props: {
        key: NodeKey,
        children: any // Array<TreeNode> | string
    }
};

export type ComponentsMapping = {
    (key: string): Component | Function
};

export type EditorDNDState = {
    targetInstance: Object,
    targetRef: HTMLElement,
    dropIndex: number,
    depth: number,
    acceptableComponents: Array<Component>,
    lastDragOverNodeKey: NodeKey
};

export type SpectroState = {
    dragAndDrop: EditorDNDState,
    enabled: boolean,
    tree: TreeNode,
    target: Object,
    onChange: () => TreeNode
};

export type SpectroConfig = {
    label: string,
    accepts: Array<Component | Function>,
    props: Object,
    void: boolean,
    textEditable: boolean,
    spellCheck: boolean
};

export type SelectionData = {
    start: number,
    end: number
};
