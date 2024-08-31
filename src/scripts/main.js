'use strict';

const grid = document.querySelector('table');
const sortOrder = {};

grid.onclick = function (e) {
  if (e.target.tagName === 'TH') {
    const th = e.target;
    const thIndex = th.cellIndex;
    const thType = getType(thIndex);

    if (!sortOrder[thIndex]) {
      sortOrder[thIndex] = 'asc';
    } else {
      sortOrder[thIndex] = sortOrder[thIndex] === 'asc' ? 'desc' : 'asc';
    }

    sortGrid(thIndex, thType, sortOrder[thIndex]);
  } else if (e.target.tagName === 'TD') {
    const tr = e.target.closest('tr');

    selectRow(tr);
  }
};

function getType(thIndex) {
  const tbody = grid.querySelector('tbody');
  const firstRow = tbody.rows[0];
  const thContent = firstRow.cells[thIndex].textContent.trim();

  if (thContent.includes('$')) {
    return 'currency';
  }

  return isNaN(thContent) ? 'string' : 'number';
}

function sortGrid(thIndex, thType, order) {
  const tbody = grid.querySelector('tbody');
  const rowsArray = Array.from(tbody.rows);

  let compare;

  switch (thType) {
    case 'number':
      compare = function (rowA, rowB) {
        return (
          parseFloat(rowA.cells[thIndex].textContent) -
          parseFloat(rowB.cells[thIndex].textContent)
        );
      };
      break;
    case 'string':
      compare = function (rowA, rowB) {
        return rowA.cells[thIndex].textContent.localeCompare(
          rowB.cells[thIndex].textContent,
        );
      };
      break;
    case 'currency':
      compare = function (rowA, rowB) {
        const valA = parseFloat(
          rowA.cells[thIndex].textContent.replace(/[$,]/g, ''),
        );
        const valB = parseFloat(
          rowB.cells[thIndex].textContent.replace(/[$,]/g, ''),
        );

        return valA - valB;
      };
      break;
  }

  rowsArray.sort(compare);

  if (order === 'desc') {
    rowsArray.reverse();
  }

  tbody.append(...rowsArray);
}

function selectRow(row) {
  const allRows = grid.querySelectorAll('tbody tr');

  allRows.forEach((r) => r.classList.remove('active'));

  row.classList.add('active');
}

const body = document.querySelector('body');

const form = document.createElement('form');

form.classList.add('new-employee-form');
body.appendChild(form);

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';
form.append(nameLabel);

const nameInput = document.createElement('input');

nameInput.setAttribute('name', 'name');
nameInput.setAttribute('data-qa', 'name');
nameInput.type = 'text';
nameLabel.append(nameInput);

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';
form.append(positionLabel);

const positionInput = document.createElement('input');

positionInput.setAttribute('name', 'position');
positionInput.setAttribute('data-qa', 'position');
positionInput.type = 'text';
positionLabel.append(positionInput);

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';
form.append(officeLabel);

const officeInput = document.createElement('select');

officeInput.setAttribute('name', 'office');
officeInput.setAttribute('data-qa', 'office');
officeLabel.append(officeInput);

const officeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

officeOptions.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  officeInput.append(option);
});

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';
form.append(ageLabel);

const ageInput = document.createElement('input');

ageInput.setAttribute('name', 'age');
ageInput.setAttribute('data-qa', 'age');
ageInput.type = 'number';
ageLabel.append(ageInput);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';
form.append(salaryLabel);

const salaryInput = document.createElement('input');

salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.type = 'number';
salaryLabel.append(salaryInput);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';
form.append(button);

form.onsubmit = function (e) {
  e.preventDefault();

  const nameValue = nameInput.value;
  const positionValue = positionInput.value;
  const officeValue = officeInput.value;
  const ageValue = parseInt(ageInput.value);
  const salaryValue = parseFloat(salaryInput.value);

  if (nameValue.length < 4) {
    showNotification('Error', 'Name must have at least 4 characters', 'error');

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    showNotification('Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  if (!positionValue) {
    showNotification('Error', 'Position undefrined', 'error');

    return;
  }

  if (isNaN(salaryValue)) {
    showNotification('Error', 'Salary must be a valid number', 'error');

    return;
  }

  const formattedSalary = salaryValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const tbody = grid.querySelector('tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameValue}</td>
    <td>${positionValue}</td>
    <td>${officeValue}</td>
    <td>${ageValue}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.appendChild(newRow);
  form.reset();
  showNotification('Success', 'New employee added successfully', 'success');
};

const showNotification = (title, message, type) => {
  const notificationEl = document.createElement('div');

  notificationEl.classList.add('notification');
  notificationEl.setAttribute('data-qa', 'notification');

  const titleEl = document.createElement('h2');

  titleEl.classList.add('title');
  titleEl.innerText = title;

  const messageEl = document.createElement('p');

  messageEl.innerText = message;

  notificationEl.classList.add(type);
  notificationEl.append(titleEl, messageEl);
  document.body.append(notificationEl);

  setTimeout(() => {
    notificationEl.remove();
  }, 50000);
};
