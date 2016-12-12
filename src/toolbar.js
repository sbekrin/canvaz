/* @flow */
import React from 'react';
import {
    unstable_renderSubtreeIntoContainer as renderSubtreeIntoContainer,
    unmountComponentAtNode } from 'react-dom';
import EditorToolbar from 'components/EditorToolbar';

let toolbarContainer: ?HTMLDivElement = null;

/**
 * Renders toolbar with specific contents
 */
export function renderToolbar (
    parentComponent: Object,
    connectors: any
): void {
    if (!toolbarContainer) {
        const placeholder: HTMLDivElement = document.createElement('div');
        placeholder.dataset.spectro = 'toolbar';
        document.body.appendChild(placeholder);
        toolbarContainer = placeholder;
    }

    renderSubtreeIntoContainer(
        parentComponent,
        <EditorToolbar>{connectors}</EditorToolbar>,
        toolbarContainer
    );
}

/**
 * Destroys toolbar
 */
export function destroyToolbar (): void {
    if (toolbarContainer) {
        unmountComponentAtNode(toolbarContainer);
        document.body.removeChild(toolbarContainer);
        toolbarContainer = null;
    }
}
