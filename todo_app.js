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

    vDOMnew.children.push(todo);
    updateDOM(vDOMold, vDOMnew);

    // remember to reset form
    e.target.reset();
};

const newSubTodo = (e) => {
  e.preventDefault();

  // remember to reset form
};

const updateDOM = (vDOMold, vDOMnew) => {
  // Fill in new virtual DOM
  vDOMnewbox.innerHTML = "<pre>" + JSON.stringify(vDOMnew, null, " ") + "</pre>"
  const dirtyNodes = vDOMdiffer(vDOMold, vDOMnew);

  // highlight differences
  const markIndexOld = vDOMoldbox.innerHTML.indexOf(JSON.stringify(dirtyNodes[0][0]));
  const markIndexNew = vDOMnewbox.innerHTML.indexOf(JSON.stringify(dirtyNodes[0][0]));
  // updateDOM

  // reset vDOMold and vDOMnew and DOM boxes
  vDOMold = deepCopy(vDOMnew);
  vDOMoldbox.innerHTML = "<pre>" + JSON.stringify(vDOMold, null, " ") + "</pre>"
  vDOMnewbox.innerHTML = "<pre></pre>"
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
