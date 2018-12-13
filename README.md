# VirtualDOM Independent Project  
In this project I replicated the basic functionality of the React.js virtual DOM and virtual DOM diffing algorithm using vanilla Javascript (including the default DOM API).  

See demo of this project here:  
[VirtualDOM-Project](https://musicpulpite.github.io/VirtualDOM-Project/)

I took inspiration from the following sources but this exact implementation is entirely my own:  
1. [Create your own virtual DOM to understand it(part 1)](https://aibolik.github.io/blog/create-your-own-virtual-dom-to-understand-it-part-1)  
2. [How to write your own virtual DOM](https://medium.com/@deathmood/how-to-write-your-own-virtual-dom-ee74acc13060)  

## Functionality  
In *node_converter* there are two methods - one for converting a DOMNode element into a POJO (plain-old-javascript object) representing the structure of the original DOM and the other for doing the inverse (virtual DOM object to DOM Node).  

So for example:
```html
<main class="root">
  <h1>Test document</h1>
  <ul id="test-ul">
    <li id="1" class="bold-or-something">hi</li>
    <li id="2">there</li>
    <li id="3">v</li>
    <li id="4">dom</li>
  </ul>
</main>
```

is interconverted with:

```javascript
{
  "type": "MAIN",
  "props": {
    "children": [
      {
        "type": "H1",
        "props": {
          "children": [],
          "innerText": "Test document"
        },
        "key": 0,
        "ref": null,
        "$$typeof": null
      },
      {
        "type": "UL",
        "props": {
          "children": [
            {
              "type": "LI",
              "props": {
                "children": [],
                "id": "1",
                "class": "bold-or-something",
                "innerText": "hi"
              },
              "key": 0,
              "ref": null,
              "$$typeof": null
            },
            {
              "type": "LI",
              "props": {
                "children": [],
                "id": "2",
                "innerText": "there"
              },
              "key": 1,
              "ref": null,
              "$$typeof": null
            },
            {
              "type": "LI",
              "props": {
                "children": [],
                "id": "3",
                "innerText": "v"
              },
              "key": 2,
              "ref": null,
              "$$typeof": null
            },
            {
              "type": "LI",
              "props": {
                "children": [],
                "id": "4",
                "innerText": "dom"
              },
              "key": 3,
              "ref": null,
              "$$typeof": null
            }
          ],
          "id": "test-ul"
        },
        "key": 1,
        "ref": null,
        "$$typeof": null
      }
    ],
    "class": "root"
  },
  "key": 1,
  "ref": null,
  "$$typeof": null
}
```

It should be noted that the structure of the virtual DOM is perfectly analogous to the original DOM. However, this lightweight representation allows us to more efficiently perform operations on the structure and query node attributes.  

The second file - *vdom_differ* - contains the method for comparing two virtual DOM objects (an old and new object, or in the case of React the virtual DOM before and after a re-rendering) and returns a list of the nodes in the old virtual DOM marked as _dirty_ and thus in need of re-rendering in the actual DOM.  

## Logic of the diffing algorithm  
The diffing algorithm recalls the structure of a BFS(breadth-first-search) in that it scans the Node tree layer by layer and stops when it finds a dirty node (there is no need to search further along that branch because every child of the dirty node will be re-rendered in the actual DOM). However, unlike a traditional BFS, this implementation exhausts the nodeQueue in order to find all dirty nodes and not just the most shallow dirty node.

The algorithm compares each node of the old vDOM with its corresponding node in  
the new vDOM and checks that their types and all props match.
```javascript
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
```
It also checks that each child of the old node and new node match up based on their keys  
(but not necessarily that their attributes or contents match).
```javascript
// Compare keys of all child nodes (deletions or insertions)
  nodeOld.props.children.forEach((childOld) => {
    let childNew = nodeNew.props.children.find(
      (childNew) => childOld.key === childNew.key
    );

    if (childNew === undefined) {
      dirtyNodeList.push([childOld, null]);
    } else {
      // Only need to do this once for each match
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
