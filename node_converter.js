// DOM node has three properties: name, attributes(hash), children(array)
// DOM node can either be element node(nodeType = 1) or text node(nodeType = 3)

// Use the DOM api to access node attributes and traverse the node tree
// recursively


// !!for now lets just pretend that no nodes have text content (innerHTML)
export const DOMtoVirtual = ($node) => {
  const vnode = {};

  vnode.name = $node.nodeName;
  Object.values($node.attributes).forEach((attr) =>
    vnode.attributes[attr.name] = attr.nodeValue);
  vnode.children = $node.children.map((child) => DOMtoVirtual(child));

  return vnode;
};

export const VirtualtoDOM = (vnode) => {
  const $node = document.createElement(vnode.name);

  for (let attr in vnode.attributes) {
    $node.setAttribute(attr, vnode.attributes[attr]);
  };

  vnode.children.forEach((child) => {
    $node.appendChild(VirtualtoDOM(child));
  });
};
