export default function dropCanvazProps(props: any): {} {
  const {
    isHovered,
    isSelected,
    isRoot,
    isEditing,
    getNode,
    getIndex,
    getDndDragNode,
    getDndTargetNode,
    getDndDropIndex,
    updateNode,
    removeNode,
    duplicateNode,
    insertNodeAt,
    ...filteredProps,
  } = props;
  return filteredProps;
}
