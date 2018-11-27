let dirtyNodeList;
let nodeQueueOld;
let nodeQueueNew;

const vDOMdiffer = (vDOMold, vDOMnew) => {
  dirtyNodeList = []; nodeQueueOld = []; nodeQueueNew = [];

  nodeQueueOld.push(vDOMold);
  nodeQueueNew.push(vDOMnew);

  while (nodeQueueOld.length > 0) {
    nodeOld = nodeQueueOld.shift();
    nodeNew = nodeQueueNew.shift();

    nodeDiffer(nodeOld, nodeNew);
  }

  return dirtyNodeList;
};

const nodeDiffer = (nodeOld, nodeNew) => {
  let dirty = false;

  // Node Name
  if (nodeOld.name !== nodeNew.name) {
    dirty = true;
  }

  // Node attributes
  for (let attr in nodeOld.attributes) {
    if (nodeOld.attributes[attr] !== nodeNew.attributes[attr]) {
      dirty = true;
    };
  };

  for (let attr in nodeNew.attributes) {
    if (nodeNew.attributes[attr] !== nodeOld.attributes[attr]) {
      dirty = true;
    };
  };

  // Node children
  nodeOld.children.forEach((child, idx) => {
    if (nodeNew.children[idx] === undefined ||
      child.name !== nodeNew.children[idx].name) {
        dirty = true;
      }
  });

  nodeNew.children.forEach((child, idx) => {
    if (nodeOld.children[idx] === undefined ||
      child.name !== nodeOld.children[idx].name) {
        dirty = true;
      }
  });

  // Node InnerText (if present)
  if (nodeOld.attributes.innerText &&
    nodeOld.attributes.innerText !== nodeNew.attributes.innerText) {
      dirty = true;
    }

  if (dirty) {
    dirtyNodeList.push(nodeOld);
  } else {
    nodeOld.children.forEach(child => nodeQueueOld.push(child));
    nodeNew.children.forEach(child => nodeQueueNew.push(child));
  }

  return
};
