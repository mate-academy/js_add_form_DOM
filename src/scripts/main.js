'use strict';

const body = document.querySelector('body');
const tableHeader = document.querySelector('thead');
const headers = document.querySelectorAll('thead th');
const bodyTable = document.querySelector('tbody');
let personInfo = [...bodyTable.rows];
let isSorted;

const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');
body.append(employeeForm);

[...headers].forEach(el => {
  const label = document.createElement('label');

  label.innerText = el.innerText + ':';

  if (el.innerText === 'Office') {
    const select = document.createElement('select');
    const office = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    select.name = el.innerText.toLowerCase();
    select.dataset.qa = el.innerText.toLowerCase();

    office.forEach(city => {
      const option = document.createElement('option');

      option.innerText = city;
      select.append(option);
    });

    label.append(select);
  } else {
    const input = document.createElement('input');

    input.name = el.innerText.toLowerCase();
    input.dataset.qa = el.innerText.toLowerCase();

    switch (el.innerText) {
      case 'Age':
      case 'Salary':
        input.type = 'number';
        break;

      default:
        input.type = 'text';
    }

    label.append(input);
  }

  employeeForm.append(label);
});

const button = document.createElement('button');

button.type = 'submit';
button.innerText = 'Save to table';
employeeForm.append(button);

employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(employeeForm);

  if (data.get('name').trim().length < 4
    || data.get('position').trim().length < 4
    || data.get('name').match(/[0-9]/)
    || data.get('position').match(/[0-9]/)) {
    pushNotification(
      'Wrong data',
      'The data must have at least 4 letters.',
      'error');

    return;
  }

  if (data.get('age') < 18 || data.get('age') > 90) {
    pushNotification(
      'Wrong age',
      'The age must be at least 18 and not more than 90 years.',
      'error');

    return;
  }

  if (data.get('salary') <= 0) {
    pushNotification(
      'Wrong salary',
      'Wrong entered salary data.The sum must be greater than 0.',
      'error');

    return;
  }

  pushNotification(
    'Successfully',
    'A new employee has been added to the table.',
    'success');

  const newRow = document.createElement('tr');

  for (const [key, value] of data) {
    const newCell = document.createElement('td');

    if (key === 'salary') {
      newCell.innerText = `$${(+value).toLocaleString('en-US')}`;

      newRow.append(newCell);
    } else {
      newCell.innerText = value;
      newRow.append(newCell);
    }
  }

  bodyTable.append(newRow);
  personInfo = [...bodyTable.rows];
  employeeForm.reset();
});

tableHeader.addEventListener('click', (e) => {
  const header = e.target.closest('th');
  const index = header.cellIndex;

  personInfo
    .sort((personA, personB) => {
      const a = personA.cells[index].innerText;
      const b = personB.cells[index].innerText;

      if (a.slice(0, 1) === '$') {
        return parseFloat(a.slice(1))
          - parseFloat(b.slice(1));
      }

      return a.localeCompare(b);
    });

  if (isSorted !== header) {
    bodyTable.append(...personInfo);
    isSorted = header;
  } else {
    bodyTable.append(...personInfo.reverse());
    isSorted = null;
  }
});

bodyTable.addEventListener('click', (e) => {
  personInfo.some(el => el.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});

bodyTable.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');
  const cellIndex = cell.cellIndex;
  const initialCellValue = cell.innerText;
  let input = document.createElement('input');

  if (cellIndex === 2) {
    input = document.createElement('select');

    const office = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    office.forEach(city => {
      const option = document.createElement('option');

      option.innerText = city;
      input.append(option);
    });
  };

  input.classList.add('cell-input');

  input.value = cell.innerText.slice(0, 1) === '$'
    ? '$'
    : cell.innerText;

  cell.firstChild.remove();
  cell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    cellDataReplacement(cell, cellIndex, input, initialCellValue);
  });

  input.addEventListener('keydown', (eventKey) => {
    if (eventKey.key !== 'Enter') {
      return;
    }

    cellDataReplacement(cell, cellIndex, input, initialCellValue);
  });
});

function pushNotification(title, description, type) {
  const message = document.createElement('div');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';

  message.innerHTML = `
    <h2 class='title'>
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `;

  body.append(message);
  setTimeout(() => message.remove(), 3000);
};

function cellDataReplacement(cell, cellIndex, input, initialCellValue) {
  cell.innerText = input.value;

  switch (cellIndex) {
    case 0:
    case 1:
      if (input.value.trim().length < 4 || input.value.match(/[0-9]/)) {
        pushNotification(
          'ERROR',
          'Incorrectly entered data.The data must have at least 4 letters.',
          'error');
        cell.innerText = initialCellValue;
      }
      break;

    case 3:
      if (isNaN(input.value) || input.value < 18 || input.value > 90) {
        pushNotification(
          'ERROR',
          'Incorrectly entered data.\n'
          + 'The age must be at least 18 and not more than 90 years.',
          'error'
        );
        cell.innerText = initialCellValue;
      }
      break;

    case 4:
      const sum = +(input.value.slice(1).split(',').join(''));

      if (isNaN(sum) || sum <= 0) {
        pushNotification(
          'ERROR',
          'Incorrectly entered data.\n'
          + 'The sum must be greater than 0.',
          'error');
        cell.innerText = initialCellValue;
      } else {
        cell.innerText = `$${(sum).toLocaleString('en-US')}`;
      }
      break;

    default:
      break;
  }

  input.remove();
};
