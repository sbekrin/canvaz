/* @flow */
import type { Element as ReactElement } from 'react';
import React from 'react';
import type { SpectroConfig } from 'types/EditorTypes';
import ToolbarSection from 'components/EditorToolbar/ToolbarSection';
import ToolbarDraggableItem from 'components/EditorToolbar/ToolbarDraggableItem';

export default function createContentsPlugin (
    spectro: SpectroConfig /* ,
    target: Object */
): ?ReactElement<any> {
    if (!spectro.accepts || spectro.accepts.length === 0) {
        return null;
    }

    return (
        <ToolbarSection key="contents-plugin" label={`${spectro.label} Contents`}>
            {spectro.accepts.map((component) => (
                <ToolbarDraggableItem
                    key={component._spectro.label}
                    onDragStart={() => {}}
                    onDragEnd={() => {}}
                >{component._spectro.label}</ToolbarDraggableItem>
            ))}
        </ToolbarSection>
    );
}
