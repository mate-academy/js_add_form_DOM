'use strict';

const form = document.createElement('form');
const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');
const rows = Array.from(tableBody.querySelectorAll('tr'));

let sortedColumn = null;
let sortOrder = 'asc';

const countries = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function selectRow(row) {
  rows.forEach((item) => {
    item.classList.remove('active');
  });

  row.classList.add('active');
}

rows.forEach((row) => {
  row.addEventListener('click', () => {
    selectRow(row);
  });
});

tableHead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const rowsTable = Array.from(tableBody.querySelectorAll('tr'));

  if (index === sortedColumn) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortedColumn = index;
    sortOrder = 'asc';
  }

  const sortedRows = rowsTable.sort((rowA, rowB) => {
    switch (index) {
      case 0:
      case 1:
      case 2:
        return rowA.cells[index].innerText.localeCompare(
          rowB.cells[index].innerText,
        );

      case 3:
        return +rowA.cells[index].innerText - +rowB.cells[index].innerText;

      case 4:
        return (
          parseFloat(rowA.cells[index].innerText.slice(1)) -
          parseFloat(rowB.cells[index].innerText.slice(1))
        );

      default:
        return 0;
    }
  });

  if (sortOrder === 'desc') {
    sortedRows.reverse();
  }

  tableBody.append(...sortedRows);
});

form.classList.add('new-employee-form');
document.body.append(form);

const formName =
  '<label>Name: <input name="name" data-qa="name" type="text"></label>';
const formPosition = `<label>Position:
    <input name="position" data-qa="position" type="text"></label>`;
const formCountry = `
  <label> Country:
  <select name="office" data-qa="office">
    ${countries.map((country) => `<option value="${country}">${country}</option>`).join('')}
  </select>
  </label>`;
const formAge = `<label>Age:
    <input name="age" data-qa="age" type="number">
  </label>`;
const formSalary = `<label>Salary: <input name="salary"
   data-qa="salary"
   type="number">
  </label>`;
const button = `<button>Save to table</button>`;

form.insertAdjacentHTML('afterbegin', button);
form.insertAdjacentHTML('afterbegin', formSalary);
form.insertAdjacentHTML('afterbegin', formAge);
form.insertAdjacentHTML('afterbegin', formCountry);
form.insertAdjacentHTML('afterbegin', formPosition);
form.insertAdjacentHTML('afterbegin', formName);

function createMessage(text, className) {
  const messageElement = document.createElement('div');

  messageElement.setAttribute('data-qa', 'notification');
  messageElement.classList.add('notification', className);
  messageElement.innerText = text;

  return messageElement;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const namePerson = data.get('name');
  const age = data.get('age');
  const position = data.get('position');
  const salary = data.get('salary');

  if (namePerson.trim().length < 4) {
    document.body.append(
      createMessage('Name value has less than 4 letters', 'error'),
    );
  } else if (position.trim().length === 0) {
    document.body.append(
      createMessage('Position field cannot be empty', 'error'),
    );
  } else if (+age < 18 || +age >= 90 || isNaN(age)) {
    document.body.append(
      createMessage('Age value is less than 18 or more than 90', 'error'),
    );
  } else if (+salary <= 0) {
    document.body.append(createMessage('Add salary', 'error'));
  } else {
    document.body.append(
      createMessage('Employee successfully added', 'success'),
    );

    const newPerson = [
      namePerson,
      position,
      data.get('office'),
      age,
      `$${(+(salary / 1000)).toFixed(3).replace('.', ',')}`,
    ];

    const newRow = tableBody.insertRow(-1);

    newPerson.forEach((item, index) => {
      const cell = newRow.insertCell(index);

      cell.innerText = item;
    });

    form.reset();
  }

  setTimeout(() => {
    const notifications = document.querySelectorAll('.notification');

    notifications.forEach((notification) => {
      notification.parentNode.removeChild(notification);
    });
  }, 3000);
});

let editedCell = null;

table.addEventListener('dblclick', (e) => {
  editedCell = e.target.textContent;

  e.target.innerHTML = `<input class="cell-input" value="${editedCell}">`;
  e.target.querySelector('.cell-input').focus();
});

table.addEventListener('blur', (e) => {
  const input = e.target;

  if (input.classList.contains('cell-input')) {
    const newText = input.value.trim() || editedCell;
    const cell = input.closest('td');

    cell.innerText = newText;
    editedCell = null;
  }
});

table.addEventListener('keypress', (e) => {
  const input = e.target;

  if (e.key === 'Enter' && input.classList.contains('cell-input')) {
    const newText = input.value.trim() || editedCell;
    const cell = input.closest('td');

    cell.innerText = newText;
    editedCell = null;
  }
});
