import isValidNode from '~/tree/is-valid-node';
import getRandomKey from '~/helpers/get-random-key';
import { mergeNodes } from '~/tree';

export default function assignKeys(node: CanvazNode) {
  if (!isValidNode(node)) {
    if (process.env.NODE_ENV === 'development') {
      throw new TypeError('Invalid Canvaz node provided to assignKeys');
    }
  }

  const traverse = (node: CanvazNode) => {
    const key =
      node.props.key || `${node.type.toLowerCase()}$${getRandomKey()}`;
    return mergeNodes(node, {
      props: {
        key,
        canvazKey: key, // Keep same key to use in API
        children: Array.isArray(node.props.children)
          ? node.props.children.map(traverse)
          : node.props.children,
      },
    });
  };

  return traverse(node);
}
