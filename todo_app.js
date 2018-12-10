let vDOMoldbox;
let vDOMnewbox;
let vDOMold;
let vDOMnew;

const newTodo = (e) => {
  e.preventDefault();

  const todo =
    createElement(
      'li',
      {},
      createElement('strong', {innerText: e.target["title"].value + ": " + e.target["description"].value}),
      createElement('ul', {}, createElement('h4', {innerText: "SubTodo List"}))
    );

    // vDOMnew = deepCopy(vDOMold);
    vDOMnew.children.push(todo);

    // let dirtyNodes = diffvDOMs(vDOMold, vDOMnew);
    // updateDOM(dirtyNodes);
    updateDOM

    // remember to reset form
    e.target.reset();
};

const newSubTodo = (e) => {
  e.preventDefault();

  // remember to reset form
};

const diffvDOMs = (vDOMold, vDOMnew) => {
  vDOMnewbox.innerHTML = "<pre>" + JSON.stringify(vDOMnew, null, " ") + "</pre>"
  dirtyNodes = vDOMdiffer(vDOMold, vDOMnew);

  // highlight differences

  return dirtyNodes;
};

const updateDOM = () => {
  for (let idx in dirtyNodeList) {

  }
};

window.addEventListener('DOMContentLoaded', () => {
  vDOMoldbox = document.getElementById('vDOMoldbox');
  vDOMnewbox = document.getElementById('vDOMnewbox');

  const todolist = document.getElementById('todolist');
  vDOMold = DOMtoVirtual(todolist);
  vDOMoldbox.innerHTML = "<pre>" + JSON.stringify(vDOMold, null, " ") + "</pre>"

  const newtodo = document.getElementById('newtodo');
  const newsubtodo = document.getElementById('newsubtodo');
  newtodo.addEventListener('submit', newTodo);
  newsubtodo.addEventListener('submit', newSubTodo);
});
