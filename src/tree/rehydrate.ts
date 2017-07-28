import * as React from 'react';
import getRandomKey from '~/helpers/get-random-key';
import isValidNode from '~/tree/is-valid-node';
import { createElement } from 'react';

export default function rehydrate(
  node: CanvazNode,
  components: { [key: string]: React.ComponentType<any> },
  overrideProps: { [key: string]: any } = { canvazRoot: false }
): React.ReactElement<any> {
  if (!isValidNode(node)) {
    if (process.env.NODE_ENV === 'development') {
      throw new TypeError('Invalid Canvaz node provided to `rehydrate`');
    }
  }

  const Component: React.ComponentType<any> | string =
    components[node.type] || node.type;
  const props = {
    ...node.props,
    ...overrideProps,
    children: Array.isArray(node.props.children)
      ? node.props.children.map(child => rehydrate(child, components))
      : node.props.children,
  };

  // Signature of React.createElement does't support React.ComponentType<any>
  // and string types as union type
  return createElement(Component as any, props);
}
