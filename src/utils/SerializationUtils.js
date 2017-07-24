/* @flow */
import { Children, isValidElement, createElement } from 'react';
import type { Element as ReactElement } from 'react';
import type { TreeNode, ComponentsMapping } from '~/types/EditorTypes';

/**
 * Creates short random key
 */
function generateRandomKey(): string {
  return Math.random().toString(36).substr(2, 5);
}

/**
 * Converts React elements tree to object
 */
export function serialize(component: ReactElement<any>): TreeNode {
  if (!isValidElement(component)) {
    return component;
  }

  // Extract component name
  let type = 'Component';

  switch (typeof component.type) {
    // Use dom element name as type
    default:
    case 'string':
      type = component.type;
      break;

    // Use `displayName` or `name` as type for class components
    case 'object':
      type = component.type.displayName || component.type.name || type;
      break;

    // Use `name` as type for functional components
    case 'function':
      type = component.type.name || type;
      break;
  }

  const props = { ...component.props };

  // Proceed children
  if (component.props.children) {
    props.children = Children.toArray(component.props.children).map(child =>
      serialize(child)
    );
  }

  return { type, props };
}

/**
 * Converts object back to React elements tree
 */
export function deserialize(object: TreeNode, typesMap: ComponentsMapping) {
  // Skip text nodes
  if (typeof object !== 'object') {
    return object;
  }

  // Get component class reference if set
  let type;

  switch (typeof typesMap) {
    case 'object':
      type = typesMap[object.type] || object.type;
      break;

    case 'function':
      type = typesMap(object.type) || object.type;
      break;

    default:
      type = object.type;
      break;
  }

  // Build new props object with `key` and `children` props setup
  const { children: prevChildren, ...prevProps } = object.props;
  const key = object.props.key || generateRandomKey();
  const props = { ...prevProps, key };
  const children = Array.isArray(prevChildren)
    ? prevChildren.map(child => deserialize(child, typesMap))
    : deserialize(prevChildren, typesMap);

  // Mutate tree in order to properly work with path
  if (!object.props.key) {
    object.props.key = key; // eslint-disable-line no-param-reassign
  }

  // Append spectroKey for custom components
  if (typeof type !== 'string') {
    props.spectroKey = key;
  }

  return createElement(type, props, children);
}
