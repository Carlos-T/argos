function div(modifiers, children) {
  return createElement('div', modifiers, children);
}

function createElement(tag, modifiers, children) {
  const element = document.createElement(tag);
  if (modifiers) {
    const classes = modifiers.match(/\.[a-z0-9\-]+/g);
    if (classes) {
      for (let c of classes) {
        element.classList.add(c.replace('.', ''));
      }
    }
    const id = modifiers.match(/#[a-z0-9\-]+/g);
    if (id) {
      element.id = id[0];
    }
    const attrs = modifiers.match(/[^\[\]]+(?=\])/g);
    if (attrs) {
      for(let a of attrs) {
        let o = a.split('=');
        element.setAttribute(o[0], o[1]);
      }
    }
  }
  if (children) {
    for(let i of children) {
      if (i instanceof HTMLElement) {
        element.appendChild(i);
      } else {
        element.innerText = i;
      }
    }
  }
  return element;
}

module.exports = {
  div,
  createElement
};