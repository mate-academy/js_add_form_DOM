'use strict';

const thead = document.querySelector('thead');
const headTableRow = thead.querySelector('tr');
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');

let countClick = 0;
const enterKeyCode = 13;
let initialText = null;
let selectedCell = null;

const form = document.createElement('form');
const inputForm = document.createElement('input');
const inputName = ['name', 'position', 'office', 'age', 'salary'];
const optionName = [`Tokyo`, `Singapore`, `London`, `New
York`, `Edinburgh`, `San Francisco`];
const labelText = ['Name:', 'Position:', 'Office:', 'Age:', 'Salary:'];
const label = document.createElement('label');
const select = document.createElement('select');
const option = document.createElement('option');
const button = document.createElement('button');

for (let i = 0; i < labelText.length; i++) {
  label.textContent = labelText[i];
  form.append(label.cloneNode(true));
}

for (let i = 0; i < optionName.length; i++) {
  option.value = optionName[i];
  option.textContent = optionName[i];
  select.append(option.cloneNode(true));
}

for (let i = 0; i < inputName.length; i++) {
  inputForm.name = inputName[i];
  inputForm.dataset.qa = inputName[i];

  if (i > 2) {
    inputForm.type = 'number';
  }

  if (i === 2) {
    select.name = inputName[i];
    select.dataset.qa = inputName[i];
    form.children[i].append(select.cloneNode(true));
  } else {
    form.children[i].append(inputForm.cloneNode());
  }
}

button.textContent = 'Save to table';
form.append(button);

form.classList.add('new-employee-form');
body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const inputValues = Object.fromEntries(data.entries());
  const newTr = document.createElement('tr');
  const td = document.createElement('td');

  if (!inputValues.position || !inputValues.salary) {
    notification(
      'Error',
      'All fields must be filled',
      'error'
    );
  } else if (inputValues.age > 90 || inputValues.age < 18) {
    notification(
      'Error',
      'The age value should be between 18 and 90 years',
      'error'
    );
  } else if (inputValues.name.length < 4) {
    notification(
      'Error',
      'The name must contain more than 4 letters',
      'error'
    );
  } else {
    for (const inputValue in inputValues) {
      switch (inputValue) {
        case 'name':
        case 'position':
          td.textContent = inputValues[inputValue].charAt(0).toUpperCase()
          + inputValues[inputValue].slice(1, inputValues[inputValue].length);
          newTr.append(td.cloneNode(true));
          break;

        case 'salary':
          td.textContent = toCashString(inputValues[inputValue].toString());
          newTr.append(td.cloneNode(true));
          break;

        default:
          td.textContent = inputValues[inputValue];
          newTr.append(td.cloneNode(true));
      }
    }

    tbody.append(newTr.cloneNode(true));
    form.reset();

    notification(
      'Perfectly',
      'A new employee is successfully added to the table',
      'success'
    );
  }
});

headTableRow.addEventListener('click', (e) => {
  const tr = [...tbody.querySelectorAll('tr')];
  const targetIndex = [...headTableRow.children].indexOf(e.target);

  sortList(tr, targetIndex, countClick % 2);
  countClick++;
});

tbody.addEventListener('click', (e) => {
  for (const item of tbody.children) {
    item.classList.remove('active');
  }

  e.target.parentElement.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const input = document.createElement('input');

  initialText = cell.textContent;
  selectedCell = cell;
  cell.textContent = '';

  input.classList.add('cell-input');
  cell.append(input);
  input.focus();

  input.addEventListener('blur', function() {
    saveChanges(input);
  });

  input.addEventListener('keypress', function(innerEvent) {
    if (innerEvent.keyCode === enterKeyCode) {
      saveChanges(input);
    }
  });
});

function saveChanges(input) {
  const newText = input.value;

  if (newText.trim() !== '') {
    const correctText = correctInput(newText, selectedCell);

    input.parentNode.removeChild(input);
    selectedCell.textContent = correctText;
  } else {
    selectedCell.textContent = initialText;
    input.parentNode.removeChild(input);
  }

  selectedCell = null;
  initialText = null;
}

function correctInput(inputValue, columnCell) {
  const columnIndex = columnCell.cellIndex;

  if (columnIndex < 3) {
    if (('0123456789').includes(inputValue.charAt(0))) {
      notification(
        'Error',
        'A word cannot start with numbers',
        'error'
      );

      return initialText;
    }

    return inputValue.charAt(0).toUpperCase()
      + inputValue.slice(1, inputValue.length);
  }

  if (columnIndex === 3) {
    if (valueHasLetters(inputValue)) {
      return initialText;
    } else if (inputValue > 90 || inputValue < 18) {
      notification(
        'Error',
        'The age value should be between 18 and 90 years',
        'error'
      );

      return initialText;
    }

    return inputValue;
  }

  if (columnIndex === 4) {
    if (valueHasLetters(inputValue)) {
      return initialText;
    }

    return toCashString(inputValue);
  }
}

function sortList(list, index, order) {
  switch (index) {
    case 0:
    case 1:
    case 2:
      list.sort((a, b) => {
        const textA = a.children[index].textContent;
        const textB = b.children[index].textContent;

        return order === 0
          ? textA.localeCompare(textB)
          : textB.localeCompare(textA);
      });
      break;

    case 3:
    case 4:
      list.sort((a, b) => {
        const numA = toNum(a.children[index].textContent);
        const numB = toNum(b.children[index].textContent);

        return order === 0
          ? numA - numB
          : numB - numA;
      });
      break;
  }

  tbody.append(...list);
}

function toNum(item) {
  let result = '';

  for (const i of item) {
    if (('0123456789').includes(i)) {
      result += i;
    }
  }

  return +result;
}

function toCashString(item) {
  const itemsArr = [];
  let intermediateStr = item;

  if (item.charAt(0) === '0') {
    notification(
      'Error',
      'A number cannot start with zero',
      'error'
    );

    return initialText;
  }

  if (intermediateStr.length <= 3) {
    return `$${intermediateStr}`;
  } else {
    while (intermediateStr.length > 3) {
      itemsArr.push(intermediateStr.slice(-3));
      intermediateStr = intermediateStr.slice(0, intermediateStr.length - 3);
    }

    itemsArr.push(intermediateStr);

    return `$${itemsArr.reverse().join(',')}`;
  }
}

function valueHasLetters(word) {
  for (let i = 0; i < word.length; i++) {
    if (!('0123456789').includes(word[i])) {
      notification(
        'Error',
        'The value must be a number',
        'error'
      );

      return true;
    }
  }

  return false;
}

function notification(title, description, type) {
  const block = document.createElement('div');
  const caption = document.createElement('h2');
  const message = document.createElement('p');

  block.className = `notification ${type}`;
  block.dataset.qa = 'notification';
  caption.textContent = title;
  message.textContent = description;
  block.append(caption, message);
  tbody.append(block);

  setTimeout(() => block.remove(), 3000);
}
