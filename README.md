# VirtualDOM Independent Project  
In this project I replicated the basic functionality of the React.js virtual DOM and virtual DOM diffing algorithm using vanilla Javascript (including the default DOM API).  

I took inspiration from the following sources but this exact implementation  
is entirely my own:  
1. [Create your own virtual DOM to understand it(part 1)](https://aibolik.github.io/blog/create-your-own-virtual-dom-to-understand-it-part-1)  
2. [How to write your own virtual DOM](https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060)  

## Functionality  
In *node_converter* there are two methods - one for converting a DOMNode element into a POJO (plain-old-javascript object) representing the structure of the original DOM and the other for doing the inverse (virtual DOM object to DOM Node).  

So for example:
```html
<main class="root">
  <h1 innertext="Test document"></h1>
  <ul id="test-ul">
    <li id="1" class="bold-or-something" innertext="hi"></li>
    <li id="2" innertext="there"></li>
    <li id="3" innertext="v"></li>
    <li id="4" innertext="dom"></li>
  </ul>
</main>
```

is interconverted with:

```javascript
{"name":"MAIN",
  "attributes":{"class":"root"},
  "children":
    [{"name":"H1",
      "attributes":{"innerText":"Test document"},
      "children":[]},
     {"name":"UL",
      "attributes":{"id":"test-ul"},
      "children":
        [{"name":"LI","attributes":{"id":"1","class":"bold-or-something","innerText":"hi"},"children":[]},     
         {"name":"LI","attributes":{"id":"2","innerText":"there"},"children":[]},
         {"name":"LI","attributes":{"id":"3","innerText":"v"},"children":[]},
         {"name":"LI","attributes":{"id":"4","innerText":"dom"},"children":[]}]
      }]
  }
```

It should be noted that the structure of the virtual DOM is perfectly analogous to the original DOM. However, this lightweight representation allows us to more efficiently perform operations on the structure and query node attributes.  

The second file - *vdom_differ* - contains the method for comparing two virtual DOM objects (an old and new object, or in the case of React the virtual DOM before and after a re-rendering) and returns a list of the nodes in the old virtual DOM marked as _dirty_ and thus in need of re-rendering in the actual DOM.  

## Logic of the diffing algorithm  
The diffing algorithm recalls the structure of a BFS(breadth-first-search) in that it scans the Node tree layer by layer and stops when it finds a dirty node (there is no need to search further along that branch because every child of the dirty node will be re-rendered in the actual DOM). However, unlike a traditional BFS, this implementation exhausts the nodeQueue in order to find all dirty nodes and not just the most shallow dirty node.

The algorithm compares each node of the old vDOM with its corresponding node in  
the new vDOM and checks that their names and all attributes match.
```javascript
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
```
It also checks that each child of the old node and new node match up  
(but not necessarily that their attributes or contents match).
```javascript
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
```
In this bare-bones implementation, only terminal nodes are checked for innerText.  
```javascript
// Node InnerText (if present)
if (nodeOld.attributes.innerText &&
  nodeOld.attributes.innerText !== nodeNew.attributes.innerText) {
    dirty = true;
}
```
If all of these conditions are met then all of the children of both nodes are pushed into their corresponding nodeQueues to be compared further on in the process. This process successfully filters all of the cases for modification:  
change of node, insertion of new node or deletion of existing node.  