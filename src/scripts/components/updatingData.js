import createSelect from './creaeteSelect';

const updatingData = () => {
  const tableTag = document.querySelector('tbody');

  tableTag.addEventListener('dblclick', (e) => {
    const target = e.target;
    const parentTag = target.parentElement;
    const line = [...parentTag.children];

    const index = line.indexOf(target);
    const prevContext = target.textContent;

    target.textContent = '';

    const formTag = document.createElement('form');
    let inputTag;
    const buttonTag = document.createElement('button');

    if (index < 2) {
      inputTag = document.createElement('input');
      inputTag.type = 'text';
    }

    if (index === 2) {
      inputTag = createSelect();

      inputTag.onchange = (ev) => {
        handleInputSubmit(ev, target, prevContext, index);
      };
    }

    if (index >= 3) {
      inputTag = document.createElement('input');
      inputTag.type = 'number';
    }
    inputTag.classList.add('cell-input');

    formTag.append(inputTag);

    buttonTag.type = 'submit';
    buttonTag.style.visibility = 'hidden';

    formTag.append(buttonTag);

    target.append(formTag);

    inputTag.addEventListener('keydown', (ev3) => {
      if (ev3.code === 'Escape') {
        target.textContent = prevContext;

        return;
      }

      if (ev3.code === 'Tab') {
        inputTag.blur();
      }
    });

    inputTag.addEventListener('blur', (ev2) => {
      const value = ev2.target.value;

      target.removeChild(target.lastChild);

      if (index === 4) {
        target.textContent = `$${Number(value).toLocaleString('en-US')}`;

        return;
      }
      target.textContent = value;
    });

    formTag.addEventListener('submit', (ev) => {
      handleInputSubmit(ev, target, prevContext, index);
    });
  });
};

export default updatingData;

function handleInputSubmit(e, elem, prevContext, queue) {
  e.preventDefault();

  let inputValue;

  if (queue === 2) {
    inputValue = e.target.value;
  } else {
    inputValue = e.target.elements[0].value;
  }

  if (!inputValue.trim().length) {
    elem.removeChild(elem.lastChild);
    elem.textContent = prevContext;

    return;
  }

  elem.removeChild(elem.lastChild);

  if (queue === 4) {
    elem.textContent = `$${Number(inputValue).toLocaleString('en-US')}`;

    return;
  }
  elem.textContent = inputValue;
}
