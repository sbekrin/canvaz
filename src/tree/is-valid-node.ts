export default function isValidNode(node: any | CanvazNode) {
  const isObject = typeof node === 'object';
  if (!isObject) {
    return false;
  }

  const isValidType = typeof node.type === 'string';
  const isValidProps = node.props ? typeof node.props === 'object' : true;
  const isValidChildren = node.children
    ? Array.isArray(node.children) ||
      typeof node.children === 'string' ||
      typeof node.children === 'number'
    : true;

  return isValidType && isValidProps && isValidChildren;
}
