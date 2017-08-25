export default function dropCanvazProps(props: any): {} {
  const {
    hovered,
    selected,
    isRoot,
    isEditing,
    getNode,
    getIndex,
    getDndDragNode,
    getDndTargetNode,
    getDndDropNode,
    getDndDropIndex,
    canDrop,
    proceedDrop,
    updateNode,
    removeNode,
    duplicateNode,
    insertNodeAt,
    ...filteredProps,
  } = props;
  return filteredProps;
}
