const addNewTodo = (e) => {
  e.preventDefault();

  let newTodo = createElement(
    type = "li",
    props = {},
    createElement(
      "h3",
      props = {innerText: `${e.target['title'].value}: ${e.target['description'].value}`}
    ),
    createElement(
      "ul",
      props = {},
    )
  );

  let lastTodo = vDOMold.props.children[vDOMold.props.children.length - 1];
  let newKey = (lastTodo ? lastTodo.key + 1 : 1);
  newTodo.key = newKey;

  vDOMnew.props.children.push(newTodo);

  // remember to reset form
  e.target.reset();
  updateDOM();
};

const addNewSubTodo = (e) => {
  e.preventDefault();

  // remember to reset form
  e.target.reset();
  updateDOM();
};

const deleteTodo = (e) => {

};

const deleteSubTodo = (e) => {

};
