// DOM node has three properties: name, attributes(hash), children(array)
// DOM node can either be element node(nodeType = 1) or text node(nodeType = 3)

// Use the DOM API to access node attributes and traverse the node tree
// recursively, converting DOMNodes into virtual elements at every step.


// I am making the assumption here that only terminal DOM nodes have inner text
// A fairly safe, but not foolproof assumption

// I am also making the assumption that all props set on virtual elements are
// valid HTML attributes that will necessarily be passed to the DOMNode.

const DOMtoVirtual = ($node) => {
  const vnode = {name: "", attributes: {}, children: []};

  vnode.name = $node.nodeName;
  Object.values($node.attributes).forEach((attr) =>
    vnode.attributes[attr.name] = attr.nodeValue);
  if ($node.children.length === 0) {
    vnode.attributes["innerText"] = $node.innerText;
  };
  vnode.children = Array.from($node.children).map((child) => DOMtoVirtual(child));


  return vnode;
};

const VirtualtoDOM = (vnode) => {
  const $node = document.createElement(vnode.name);

  for (let attr in vnode.attributes) {
    debugger
    $node.setAttribute(attr, vnode.attributes[attr]);
  };

  if (vnode.attributes.innerText) {
    $node.removeAttribute("innerText");
    $node.innerHTML = vnode.attributes.innerText;
  };

  vnode.children.forEach((child) => {
    $node.appendChild(VirtualtoDOM(child));
  });

  return $node
};

// Let's go ahead and write a ReactDOM.render method so that we can modify the
// DOM at specific points in the tree with our newly created virtual elements

const render = (vnode, $parentNode) => {
  const HTMLstring = VirtualtoDOM(vnode).outerHTML;
  $parentNode.innerHTML = HTMLstring;
};

// Lastly, let's go ahead and provide the ability to directly create virtual
// elements. This is our rendition of the React.createElement method

const createElement = (name, attributes, ...children) => {
  const vnode = {name: name, attributes: attributes, children: children};

  return vnode;
};
