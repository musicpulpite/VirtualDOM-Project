let oldvDOM;
let newvDOM;
let vDOMs = [null, null];

const convertDOM = (e) => {
  let domName = e.currentTarget.id;
  let vDOM = window[domName];

  if (!vDOMs[0]) {
    vDOMs[0] = vDOM;
    e.currentTarget.classList.add('old');
  } else if (!vDOMs[1]) {
    vDOMs[1] = vDOM;
    e.currentTarget.classList.add('new');
  }

  oldvDOM.innerHTML = '<pre>' + JSON.stringify(vDOMs[0], null, 1) + '</pre>';
  newvDOM.innerHTML = '<pre>' + JSON.stringify(vDOMs[1], null, 1) + '</pre>';
};

diffAndHighlight = (e) => {
  if (!vDOMs[0] || !vDOMs[1]) return;

  let dirtyNodes = vDOMdiffer(vDOMs[0], vDOMs[1]);

  dirtyNodes.forEach((nodePair) => {
    if (nodePair[0]) {
      nodePair[0].ref.classList.add('old');
    }
    if (nodePair[1]) {
      nodePair[1].ref.classList.add('new');
    }
  })
};

resetPage = (e) => {
  vDOMs = [null, null];

  oldvDOM.innerHTML = '<pre>' + JSON.stringify(vDOMs[0], null, 1) + '</pre>';
  newvDOM.innerHTML = '<pre>' + JSON.stringify(vDOMs[1], null, 1) + '</pre>';

  let oldElements = document.getElementsByClassName('old');
  Array.from(oldElements).forEach((el) => el.classList.remove('old'));

  let newElements = document.getElementsByClassName('new');
  Array.from(newElements).forEach((el) => el.classList.remove('new'));

};

document.addEventListener('DOMContentLoaded', () => {
  oldvDOM = document.getElementById('oldvDOM');
  newvDOM = document.getElementById('newvDOM');

  const diffButton = document.getElementById('diff');
  diffButton.addEventListener('click', diffAndHighlight)

  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', resetPage)

  const divs = document.getElementsByTagName('div');
  divs[0].addEventListener('click', convertDOM);
  divs[1].addEventListener('click', convertDOM);
  divs[2].addEventListener('click', convertDOM);
  divs[3].addEventListener('click', convertDOM);
  divs[4].addEventListener('click', convertDOM);
});
