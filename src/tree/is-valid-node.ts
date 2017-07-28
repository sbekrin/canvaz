export default function isValidNode(node: any | CanvazNode) {
  const isObject = typeof node === 'object';
  if (!isObject) {
    return false;
  }

  const isValidType = typeof node.type === 'string';
  const isValidProps = typeof node.props === 'object';
  return isValidType && isValidProps;
}
