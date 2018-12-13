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
  // let unmatchedChildren = false;
  let cleanChildrenOld = [];
  let cleanChildrenNew = [];

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
    let childNew = nodeNew.props.children.find(
      (childNew) => childOld.key === childNew.key
    );

    if (childNew === undefined) {
      dirtyNodeList.push([childOld, null]);
      // unmatchedChildren = true;
    } else {
      cleanChildrenOld.push(childOld);
      cleanChildrenNew.push(childNew);
    };
  });

  nodeNew.props.children.forEach((childNew) => {
    let childOld = nodeOld.props.children.find(
      (childOld) => childNew.key === childOld.key
    );

    if (childOld === undefined) {
      dirtyNodeList.push([null, childNew]);
      // unmatchedChildren = true;
    }
    // else {
    //   cleanChildrenNew.push(childNew);
    //   cleanChildrenOld.push(childOld);
    // };
  });

  // Node InnerText (if present)
  if (nodeOld.props.innerText &&
    nodeOld.props.innerText !== nodeNew.props.innerText) {
      dirty = true;
  }

  if (dirty) {
    dirtyNodeList.push([nodeOld, nodeNew]);
  } else {
    cleanChildrenOld.forEach(child => nodeQueueOld.push(child));
    cleanChildrenNew.forEach(child => nodeQueueNew.push(child));
  }
  // else if (unmatchedChildren === false) {
  //   nodeOld.props.children.forEach(child => nodeQueueOld.push(child));
  //   nodeNew.props.children.forEach(child => nodeQueueNew.push(child));
  // }

  return
};
