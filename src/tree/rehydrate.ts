import * as React from 'react';
import getRandomKey from '~/helpers/get-random-key';
import isValidNode from '~/tree/is-valid-node';

export default function rehydrate(
  node: CanvazNode,
  components: { [key: string]: React.ComponentType<any> },
  setSchema: (type: string, map: { [key: string]: boolean }) => void
): React.ReactElement<any> {
  if (!isValidNode(node)) {
    if (process.env.NODE_ENV === 'development') {
      throw new TypeError('Invalid Canvaz node provided to `rehydrate`');
    }
  }

  const Component: React.ComponentType<any> | string =
    components[node.type] || node.type;
  const config: CanvazConfig | null =
    typeof Component === 'function' ? (Component as any).canvaz : null;
  const props = { ...node.props };
  const children = Array.isArray(node.children)
    ? node.children.map(child => rehydrate(child, components, setSchema))
    : node.children;

  if (config) {
    // Retrieve data for schema
    const allowedChildList = Object.keys(config.accept);
    const allowedChildMap =
      allowedChildList.length > 0
        ? allowedChildList.reduce((map, type) => ({ ...map, [type]: true }), {})
        : {};
    setSchema(node.type, allowedChildMap);
  }

  // Signature of React.createElement does't support React.ComponentType<any>
  // and string types as union type
  return React.createElement(Component as any, props, children);
}
