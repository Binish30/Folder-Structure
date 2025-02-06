export const findAndUpdateNode = (node, id, isParent, parent = null, callback) => {
  if (node.id === id) {
    callback(isParent ? parent : node);
    return true;
  }
  return node.children?.some((child) => findAndUpdateNode(child, id, isParent, node, callback));
};

