let vDOMoldbox;
let vDOMnewbox;
let vDOMold;
let vDOMnew;

const updateDOM = () => {
  // Fill in new virtual DOM
  vDOMnewbox.innerHTML = "<pre>" + JSON.stringify(vDOMnew, null, 3) + "</pre>";
  const dirtyNodes = vDOMdiffer(vDOMold, vDOMnew);

  // highlight differences
  dirtyNodes.forEach((nodePair) => {

    if (nodePair[0]) {
      // let text =
      // JSON.stringify(vDOMold).replace(
      //   JSON.stringify(nodePair[0]),
      //   `<strong class="old">${JSON.stringify(nodePair[0])}</strong>`
      // );
      //
      // vDOMoldbox.innerHTML =
      //   "<pre>" +
      //   JSON.stringify(JSON.parse(text), null, 2) +
      //   "</pre>";

      vDOMoldbox.innerHTML =
      JSON.stringify(vDOMold).replace(
        JSON.stringify(nodePair[0]),
        `<strong class="old">${JSON.stringify(nodePair[0])}</strong>`
      );

    }

    if (nodePair[1]) {
      // let text =
      // JSON.stringify(vDOMnew).replace(
      //   JSON.stringify(nodePair[1]),
      //   `<strong class="new">${JSON.stringify(nodePair[1])}</strong>`
      // );
      //
      // vDOMnewbox.innerHTML =
      //   "<pre>" +
      //   JSON.stringify(JSON.parse(text), null, 2) +
      //   "</pre>";

      vDOMnewbox.innerHTML =
      JSON.stringify(vDOMnew).replace(
        JSON.stringify(nodePair[1]),
        `<strong class="new">${JSON.stringify(nodePair[1])}</strong>`
      );
    }
  });

  debugger

  window.setTimeout(() => {
    // updateDOM
    // reset vDOMold and vDOMnew and DOM boxes
    vDOMold = deepCopy(vDOMnew);
    vDOMoldbox.innerHTML = "<pre>" + JSON.stringify(vDOMold, null, 3) + "</pre>"
    vDOMnewbox.innerHTML = "<pre></pre>"
  }, 4000)
};

window.addEventListener('DOMContentLoaded', () => {
  vDOMoldbox = document.getElementById('vDOMoldbox');
  vDOMnewbox = document.getElementById('vDOMnewbox');

  // const todolist = document.getElementById('todolist');
  vDOMold = createElement(
    type = "ul",
    props = {id: "todolist"}
  );
  vDOMnew = deepCopy(vDOMold);
  vDOMoldbox.innerHTML = "<pre>" + JSON.stringify(vDOMold, null, 3) + "</pre>"
  vDOMnewbox.innerHTML = "<pre></pre>";

  const newtodo = document.getElementById('newtodo');
  const newsubtodo = document.getElementById('newsubtodo');
  newtodo.addEventListener('submit', addNewTodo);
  newsubtodo.addEventListener('submit', addNewSubTodo);
});
