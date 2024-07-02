'use strict';

const table = document.querySelector('table');

// #region sorting
const headers = table.tHead.rows[0].cells;
let sortDirectionName = -1;
let sortDirectionPosition = -1;
let sortDirectionOffice = -1;
let sortDirectionAge = -1;
let sortDirectionSalary = -1;

function sortByName(row1, row2) {
  const firstRowName = row1.cells[0].textContent;
  const secondRowName = row2.cells[0].textContent;

  return firstRowName.localeCompare(secondRowName) * sortDirectionName;
}

function sortByPosition(row1, row2) {
  const firstRowPosition = row1.cells[1].textContent;
  const secondRowPosition = row2.cells[1].textContent;

  return (
    firstRowPosition.localeCompare(secondRowPosition) * sortDirectionPosition
  );
}

function sortByOffice(row1, row2) {
  const firstRowOffice = row1.cells[2].textContent;
  const secondRowOffice = row2.cells[2].textContent;

  return firstRowOffice.localeCompare(secondRowOffice) * sortDirectionOffice;
}

function sortByAge(row1, row2) {
  const firstRowAge = +row1.cells[3].textContent;
  const secondRowAge = +row2.cells[3].textContent;

  return (firstRowAge - secondRowAge) * sortDirectionAge;
}

function sortBySalary(row1, row2) {
  const firstRowSalary = +row1.cells[4].textContent.replace(/\D/g, '');
  const secondRowSalary = +row2.cells[4].textContent.replace(/\D/g, '');

  return (firstRowSalary - secondRowSalary) * sortDirectionSalary;
}

function handleSort(e) {
  const tableBody = table.tBodies[0];
  const rows = [...tableBody.rows];
  const newTableBody = document.createElement('tbody');
  let sortedRows = [];

  switch (e.target.textContent) {
    case 'Name':
      sortDirectionName *= -1;

      sortDirectionPosition =
        sortDirectionOffice =
        sortDirectionAge =
        sortDirectionSalary =
          -1;

      sortedRows = rows.sort(sortByName);
      break;

    case 'Position':
      sortDirectionPosition *= -1;

      sortDirectionName =
        sortDirectionOffice =
        sortDirectionAge =
        sortDirectionSalary =
          -1;

      sortedRows = rows.sort(sortByPosition);
      break;

    case 'Office':
      sortDirectionOffice *= -1;

      sortDirectionName =
        sortDirectionPosition =
        sortDirectionAge =
        sortDirectionSalary =
          -1;

      sortedRows = rows.sort(sortByOffice);
      break;

    case 'Age':
      sortDirectionAge *= -1;

      sortDirectionName =
        sortDirectionPosition =
        sortDirectionOffice =
        sortDirectionSalary =
          -1;

      sortedRows = rows.sort(sortByAge);
      break;

    case 'Salary':
      sortDirectionSalary *= -1;

      sortDirectionName =
        sortDirectionPosition =
        sortDirectionOffice =
        sortDirectionAge =
          -1;

      sortedRows = rows.sort(sortBySalary);
      break;
  }

  sortedRows.forEach((row) => newTableBody.appendChild(row));
  table.replaceChild(newTableBody, tableBody);
}

[...headers].forEach((header) => {
  header.addEventListener('click', handleSort);
});
// #endregion

// #region row selection
function handleRowSelection(e) {
  [...table.tBodies[0].rows].forEach((row) => {
    row.classList.remove('active');
  });

  e.currentTarget.classList.add('active');
}

[...table.tBodies[0].rows].forEach((row) => {
  row.addEventListener('click', handleRowSelection);
});
// #endregion

// #region form
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label for="name">Name: <input name="name" id="name" type="text" data-qa="name"></label>

  <label for="position">Position: <input name="position" id="position" type="text" data-qa="position"></label>

  <label for="office">
    Office:

    <select name="office" id="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label for="age">Age: <input name="age" id="age" type="number" data-qa="age"></label>

  <label for="salary">Salary: <input name="salary" id="salary" type="number" data-qa="salary"></label>

  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);
// #endregion

// #region submission
const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => document.body.removeChild(notification), 2000);
};

function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(e.currentTarget);

  for (const value of data.values()) {
    if (!value.trim()) {
      pushNotification(10, 10, 'Error', 'All fields are required', 'error');

      return;
    }
  }

  if (data.get('name').length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Name should contain more than 4 letters',
      'error',
    );

    return;
  }

  if (data.get('age') < 18) {
    pushNotification(10, 10, 'Error', 'The employee must be over 18', 'error');

    return;
  }

  if (data.get('age') > 90) {
    pushNotification(10, 10, 'Error', 'The employee must be under 90', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${data.get('office')}</td>
    <td>${data.get('age')}</td>
    <td>${'$' + Number(data.get('salary')).toLocaleString('en-US')}</td>
  `;

  pushNotification(
    10,
    10,
    'Success',
    'New employee successfully added',
    'success',
  );

  [...newRow.cells].forEach((cell) => {
    cell.addEventListener('dblclick', handleEdit);
  });
  table.tBodies[0].appendChild(newRow);
}

form.addEventListener('submit', handleSubmit);
// #endregion

// #region editing cells
function handleEdit(e) {
  const cell = e.target;
  const initialText = cell.textContent;
  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';

  function handleEnteredText(TextEnterEvent) {
    const enteredText = TextEnterEvent.target.value.trim();

    if (enteredText) {
      cell.textContent = enteredText;
    } else {
      cell.textContent = initialText;
    }

    cell.removeChild(input);
  }

  input.addEventListener('blur', handleEnteredText);

  input.addEventListener('keypress', (EnterKeyEvent) => {
    if (EnterKeyEvent.key === 'Enter') {
      handleEnteredText(EnterKeyEvent);
    }
  });

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();
}

[...document.querySelectorAll('td')].forEach((cell) => {
  cell.addEventListener('dblclick', handleEdit);
});
// #endregion
