/* @flow */
import type { Element as ReactElement } from 'react';
import React, { cloneElement } from 'react';
import ToolbarSection from '~/components/EditorToolbar/ToolbarSection';
import type { SpectroConfig } from '~/types/EditorTypes';

export default function createPropsPlugin(
  spectro: SpectroConfig,
  target: Object
): ?ReactElement<any> {
  if (!spectro.props || Object.keys(spectro.props).length === 0) {
    return null;
  }

  const propertyConnectors = Object.keys(spectro.props).map(propName =>
    cloneElement(spectro.props[propName], {
      key: `connector-${propName}`,
      nodeKey: target.props.spectroKey,
      prop: propName,
      value: target.props[propName],
    })
  );

  return (
    <ToolbarSection key="props-plugin" label={`${spectro.label} Props`}>
      {propertyConnectors}
    </ToolbarSection>
  );
}
