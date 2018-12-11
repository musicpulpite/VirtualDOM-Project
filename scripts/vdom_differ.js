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
  let unmatchedChildren = false;

  // Node Name
  if (nodeOld.type !== nodeNew.type) {
    dirty = true;
  }

  // Node attributes
  for (let prop in nodeOld.props) {
    if (prop === "children") continue;
    if (nodeOld.props[prop] !== nodeNew.props[prop]) {
      dirty = true;
    };
  };

  for (let prop in nodeNew.props) {
    if (prop === "children") continue;
    if (nodeNew.props[prop] !== nodeOld.props[prop]) {
      dirty = true;
    };
  };

  // Compare keys of all child nodes (deletions or insertions)
  nodeOld.props.children.forEach((childOld) => {
    let newMatch = nodeNew.props.children.find(
      (childNew) => childOld.key === childNew.key
    );

    if (newMatch === undefined) {
      dirtyNodeList.push([childOld, null]);
      unmatchedChildren = true;
    };
  });

  nodeNew.props.children.forEach((childNew) => {
    let oldMatch = nodeOld.props.children.find(
      (childOld) => childNew.key === childOld.key
    );

    if (oldMatch === undefined) {
      dirtyNodeList.push([null, childNew]);
      unmatchedChildren = true;
    };
  });

  // Node InnerText (if present)
  if (nodeOld.props.innerText &&
    nodeOld.props.innerText !== nodeNew.props.innerText) {
      dirty = true;
  }

  if (dirty) {
    dirtyNodeList.push([nodeOld, nodeNew]);
  } else if (unmatchedChildren === false) {
    nodeOld.props.children.forEach(child => nodeQueueOld.push(child));
    nodeNew.props.children.forEach(child => nodeQueueNew.push(child));
  }

  return
};
