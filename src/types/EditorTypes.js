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

};

export type SpectroState = {
    dragAndDrop: EditorDNDState,
    enabled: boolean,
    tree: TreeNode,
    onChange: () => TreeNode
};

export type SpectroConfig = {
    label: string,
    accepts: Array<Component | Function>,
    void: boolean,
    textEditable: boolean,
    spellCheck: boolean
};

export type SelectionData = {
    start: number,
    end: number
};
