// A DOM node has three properties: name, attributes(hash), children(array)
// A virtual DOM node has: type, attributes(including children), ref, key, $$typeof
// For now we will not be dealing with custom react components, just representations
// of valid HTML elements.

// Use the DOM API to access node attributes and traverse the node tree
// recursively, converting DOMNodes into virtual elements at every step.


// I am making the assumption here that only terminal DOM nodes have inner text
// A fairly safe, but not foolproof assumption

// I am also making the assumption that all props set on virtual elements are
// valid HTML attributes that will necessarily be passed to their respective
// DOMNodes.

const DOMtoVirtual = ($node, key = 1) => {
  const vnode =
    {type: "",
    props: {children: []},
    key: null,
    ref: null,
    $$typeof: null};

  vnode.type = $node.nodeName;

  Object.values($node.attributes).forEach((attr) =>
    vnode.props[attr.name] = attr.nodeValue);

  if ($node.children.length === 0) {
    vnode.props["innerText"] = $node.innerText;
  };

  // We need to assign unique keys for every vDOM Node
  // Id's are inherently unique, but we will assign its index otherwise
  vnode.key = $node.id || key;

  vnode.props.children = Array.from($node.children).map((child, key) =>
    DOMtoVirtual(child, key));

  // note this!
  vnode.ref = $node;

  return vnode;
};

const VirtualtoDOM = (vnode) => {
  const $node = document.createElement(vnode.type);

  for (let prop in vnode.props) {
    if (prop === "children") continue;
    $node.setAttribute(prop, vnode.props[prop]);
  };

  if (vnode.props.innerText) {
    $node.removeAttribute("innerText");
    $node.innerHTML = vnode.props.innerText;
  };

  vnode.props.children.forEach((child) => {
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

const createElement = (type, props, ...children) => {
  const vnode = {
    type: type,
    props: {...props, children: children},
    key: null,
    ref: null,
    $$typeof: null};

  return vnode;
};
