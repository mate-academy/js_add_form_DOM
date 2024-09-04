'use strict';

import { formFields } from './constants/formFields';

let selectedColumn = null;
let sortOrder = 'asc';
const regExp = /^[a-zA-Z\s]+$/;

const table = document.querySelector('table');
const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

const rows = [...tBody.querySelectorAll('tr')];

const selectRow = (row) => {
  rows.forEach((rowItem) => {
    rowItem.classList.remove('active');
  });

  row.classList.add('active');
};

rows.forEach((row) => {
  row.addEventListener('click', () => {
    selectRow(row);
  });
});

tHead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;

  if (index === selectedColumn) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    selectedColumn = index;
    sortOrder = 'asc;';
  }

  const rowTable = [...tBody.querySelectorAll('tr')];

  const sortedRows = rowTable.sort((rowA, rowB) => {
    const cellsA = rowA.cells[index].innerText;
    const cellsB = rowB.cells[index].innerText;

    switch (index) {
      case 0:
      case 1:
      case 2:
        return cellsA.localeCompare(cellsB);

      case 3:
        return Number(cellsA) - Number(cellsB);

      case 4:
        return parseFloat(cellsA.slice(1)) - parseFloat(cellsB.slice(1));
    }
  });

  if (sortOrder === 'desc') {
    sortedRows.reverse();
  }

  tBody.append(...sortedRows);
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

formFields.forEach(({ label, name: fName, type, options }) => {
  const field = document.createElement('label');

  field.innerHTML = `${label}: ${
    type === 'select'
      ? `<select name="${fName}" data-qa="${fName}">
        ${options.map((option) => `<option value="${option}">${option}</option>`).join('')}
      </select>`
      : `<input name="${fName}" data-qa="${fName}" type="${type}">`
  }`;

  form.append(field);
});

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

const createMessage = (text, className) => {
  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');
  message.classList = `notification ${className}`;
  message.innerText = text;

  return message;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const position = data.get('position').trim();
  const salary = data.get('salary').trim();
  const office = data.get('office').trim();
  const fName = data.get('name').trim();
  const age = data.get('age').trim();

  const isValidField = (str) => regExp.test(str);

  const message = [
    { condition: fName.length < 4, text: 'Name value has less than 4 letters' },
    {
      condition: !isValidField(fName) || !isValidField(position),
      text: 'Name and Position must contain only Latin letters and spaces.',
    },
    { condition: !position.length, text: 'Position field cannot be empty' },
    {
      condition: +age < 18 || +age > 90,
      text: 'Age value is less than 18 or more than 90',
    },
    { condition: +salary <= 0, text: 'Add salary' },
  ];

  for (const { condition, text } of message) {
    if (condition) {
      document.body.append(createMessage(text, 'error'));

      return;
    }
  }

  const newPerson = [
    fName,
    position,
    office,
    age,
    `$${(+(salary / 1000)).toFixed(3).replace('.', ',')}`,
  ];

  const newRow = tBody.insertRow(-1);

  newPerson.forEach((item, index) => {
    const cell = newRow.insertCell(index);

    cell.innerText = item;
  });

  document.body.append(createMessage('Employee successfully added', 'success'));
  form.reset();

  setTimeout(() => {
    document.querySelectorAll('.notification').forEach((notification) => {
      notification.remove();
    });
  }, 3000);
});

let editedCell = null;

table.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  editedCell = cell.textContent;
  cell.innerHTML = `<input class="cell-input" value="${editedCell}">`;
  cell.querySelector('.cell-input').focus();
});

table.addEventListener(
  'blur',
  (e) => {
    const input = e.target;

    if (!input.classList.contains('cell-input')) {
      return;
    }

    const cell = input.closest('td');

    cell.innerText = input.value().trim() || editedCell;
    editedCell = null;
  },
  true,
);

table.addEventListener('keypress', (e) => {
  const input = e.target;

  if (e.key !== 'Enter' && !input.classList.contains('cell-input')) {
    return;
  }

  const newText = input.value().trim();

  if (!regExp.test(newText)) {
    alert('Use only Latin letters and spaces.');
    e.preventDefault();

    return;
  }

  const cell = input.closest('td');

  cell.innerText = newText || editedCell;
  editedCell = null;
});
