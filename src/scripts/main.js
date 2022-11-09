'use strict';

const head = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const headTh = [...head.firstElementChild.children];

let firstClick = true;
let lastClickIndex = null;

head.addEventListener('click', (e) => {
  const index = e.target.cellIndex;

  firstClick = (lastClickIndex !== index) ? true : !firstClick;
  lastClickIndex = index;

  getSortedList(index, firstClick, (index === 4));
});

function getSortedList(i, asc, format) {
  const sortedElements = [...tbody.children].sort((a, b) => {
    let first = a.children[i].innerText;
    let second = b.children[i].innerText;

    if (format) {
      first = formatData(first);
      second = formatData(second);
    }

    if (!isNaN(first)) {
      return (asc) ? first - second : second - first;
    }

    return (asc) ? first.localeCompare(second) : second.localeCompare(first);
  });

  tbody.append(...sortedElements);
}

function formatData(text) {
  return text.replace(/\D/g, '');
}

tbody.addEventListener('click', (e) => {
  selectRow(e.target.parentElement);
});

function selectRow(tr) {
  for (const el of tbody.children) {
    el.classList.remove('active');
  }
  tr.classList.add('active');
}

const form = document.createElement('form');

form.classList.add('new-employee-form');
addInputsAndButtonToForm();
document.body.lastElementChild.before(form);

function addInputsAndButtonToForm() {
  headTh.forEach((el, i) => {
    const label = document.createElement('label');
    const text = el.innerText;
    const elementType
      = formatData(tbody.firstElementChild.children[i].innerText);
    const type = (!isNaN(elementType) && elementType !== '')
      ? 'number'
      : 'text';

    const input = `
      <input 
      type="${type}"
      name="${text.toLowerCase()}"
      data-qa="${text.toLowerCase()}"
      required
      >
    `;
    const select = `
      <select
      name="${text.toLowerCase()}"
      data-qa="${text.toLowerCase()}"
      >
        <option>
          Tokyo
        </option>
        <option>
          Singapore
        </option>
        <option>
          London
        </option>
        <option>
          New York
        </option>
        <option>
          Edinburgh
        </option>
        <option>
          San Francisco
        </option>
      </select>
    `;

    if (text === 'Office') {
      label.innerHTML = `
        ${text}:
        ${select}
      `;
    } else {
      label.innerHTML = `
        ${text}:
        ${input}
      `;
    }

    form.append(label);
  });

  const button = document.createElement('button');

  button.type = 'submit';
  button.innerText = 'Save to table';
  form.append(button);
}

const labels = [...document.querySelectorAll('label')];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const formData = Object.fromEntries(data.entries());
  const tr = document.createElement('tr');

  labels.forEach(el => {
    const td = document.createElement('td');
    const inputName = el.firstElementChild.name;
    let value = el.firstElementChild.value;

    if (inputName === 'salary') {
      value = formatSalaryData(value);
    }
    td.innerText = value;
    tr.append(td);
  });

  if (validationForForm(formData)) {
    tbody.append(tr);
    form.reset();
  }
});

function formatSalaryData(data) {
  let value = +data;

  value = '$' + value.toLocaleString('en-US');

  return value;
}

function validationForForm(data) {
  if (data.hasOwnProperty('name')) {
    if (data.name.length < 4 || /\d/.test(data.name)) {
      showNotification('Error',
        `Enter a valid name. `
        + `Name must not be less than 4 letters and not contain numbers!`,
        'error'
      );

      return false;
    }
  }

  if (data.hasOwnProperty('position')) {
    if (data.position.length < 4 || /\d/.test(data.position)) {
      showNotification('Error',
        `Enter a valid position. `
        + `Position must not be less than 4 letters and not contain numbers!`,
        'error'
      );

      return false;
    }
  }

  if (data.hasOwnProperty('office')) {
    const offices
      = [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ];

    if (!offices.includes(data.office)) {
      showNotification('Error',
        'Enter a valid location. Office does not exist in this city!',
        'error'
      );

      return false;
    }
  }

  if (data.hasOwnProperty('age')) {
    if (+data.age < 18 || +data.age > 90 || isNaN(+data.age)) {
      showNotification('Error',
        'Enter a valid Age. Age must be at least 18 and not more than 90!',
        'error'
      );

      return false;
    }
  }

  if (data.hasOwnProperty('salary')) {
    if (isNaN(+data.salary) || data.salary === '') {
      showNotification('Error',
        'Enter a valid salary. Salary must contain only numbers!',
        'error'
      );

      return false;
    }
  }

  showNotification('Success',
    'Data added successfully!',
    'success'
  );

  return true;
}

function showNotification(title, description, type) {
  const element = document.createElement('div');

  element.dataset.qa = 'notification';
  element.classList.add('notification', type);

  element.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>`;

  document.body.append(element);

  setTimeout(() => element.remove(), 3000);
}

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const cellIndex = e.target.cellIndex;
  const cellText = cell.innerText;
  const cellName = headTh[cellIndex].innerText;

  const input = inputForTable();

  const setInputValue = (ev) => {
    let inputValue = ev.target.value;
    const inputData = {};

    inputData[cellName.toLowerCase()] = inputValue;

    if (cellName === 'Salary') {
      inputValue = formatSalaryData(inputValue);
    }

    if (validationForForm(inputData)) {
      cell.innerText = inputValue;
    } else {
      cell.innerText = cellText;
    }
  };

  cell.innerText = '';
  cell.append(input);
  input.focus();

  input.addEventListener('blur', (ev) => {
    setInputValue(ev);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.code !== 'Enter') {
      return;
    }

    setInputValue(ev);
  });
});

function inputForTable() {
  const input = document.createElement('input');

  input.classList.add('cell-input');

  return input;
}
