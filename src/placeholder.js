/* @flow */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import EditorPlaceholder from '~/components/EditorPlaceholder';

let placeholderContainer: ?HTMLDivElement = null;

/**
 * Renders placeholder at specific position and width
 */
export function renderPlaceholder(x: number, y: number, width: number): void {
  if (!placeholderContainer) {
    const placeholder: HTMLDivElement = document.createElement('div');
    placeholder.dataset.spectro = 'placeholder';
    document.body.appendChild(placeholder);
    placeholderContainer = placeholder;
  }

  render(<EditorPlaceholder x={x} y={y} width={width} />, placeholderContainer);
}

/**
 * Destroys placeholder
 */
export function destroyPlaceholder(): void {
  if (placeholderContainer) {
    unmountComponentAtNode(placeholderContainer);
    document.body.removeChild(placeholderContainer);
    placeholderContainer = null;
  }
}
