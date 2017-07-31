export default function dropCanvazProps(props: any): {} {
  const {
    isHovered,
    isSelected,
    isRoot,
    isEditing,
    updateNode,
    removeNode,
    ...filteredProps,
  } = props;
  return filteredProps;
}
