export default function dropCanvazProps(props: any): {} {
  const {
    isHovered,
    isSelected,
    isRoot,
    isEditing,
    getNode,
    updateNode,
    removeNode,
    duplicateNode,
    moveNode,
    ...filteredProps,
  } = props;
  return filteredProps;
}
