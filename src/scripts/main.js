'use strict';

const tableHead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = [...tbody.rows];

let sortedColumn = null;
let sortOrder = 'asc';

tableHead.addEventListener('click', (e) => {
  if (e.target.closest('th')) {
    const header = e.target.closest('th');
    const sortName = header.textContent;
    const cellIndex = e.target.closest('th').cellIndex;

    if (cellIndex === sortedColumn) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortedColumn = cellIndex;
      sortOrder = 'asc';
    }

    if (sortOrder === 'asc') {
      rows.sort((a, b) => {
        switch (sortName) {
          case 'Position':
          case 'Name':
          case 'Office':
            return a.cells[cellIndex].textContent.localeCompare(
              b.cells[cellIndex].textContent,
            );

          case 'Salary':
            const salaryA = a.cells[cellIndex].textContent.replace(/[$,]/g, '');
            const salaryB = b.cells[cellIndex].textContent.replace(/[$,]/g, '');

            return salaryA - salaryB;

          default:
            return (
              a.cells[cellIndex].textContent - b.cells[cellIndex].textContent
            );
        }
      });

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    }

    if (sortOrder === 'desc') {
      rows.reverse();

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    }
  }
});

let selectedRow = null;

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  const rowIndex = row.sectionRowIndex;

  if (selectedRow === null) {
    tbody.rows[rowIndex].classList.add('active');
    selectedRow = rowIndex;
  } else {
    tbody.rows[selectedRow].classList.remove('active');

    selectedRow = rowIndex;
    tbody.rows[rowIndex].classList.add('active');
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.noValidate = true;
document.body.appendChild(form);

const countries = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

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
const button = '<button>Save to table</button>';

form.insertAdjacentHTML('afterbegin', button);
form.insertAdjacentHTML('afterbegin', formSalary);
form.insertAdjacentHTML('afterbegin', formAge);
form.insertAdjacentHTML('afterbegin', formCountry);
form.insertAdjacentHTML('afterbegin', formPosition);
form.insertAdjacentHTML('afterbegin', formName);

const inputs = form.querySelectorAll('input');

inputs.forEach((input) => input.setAttribute('required', ''));

const createNotification = (text, className) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', className);
  notification.setAttribute('data-qa', 'notification');

  const desctiption = document.createElement('h1');

  desctiption.classList.add('title');
  desctiption.textContent = text;
  notification.appendChild(desctiption);

  return notification;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // eslint-disable-next-line no-shadow
  const name = form.querySelector('[data-qa="name"]').value;
  const position = form.querySelector('[data-qa="position"]').value;
  const age = form.querySelector('[data-qa="age"]').value;
  const salary = form.querySelector('[data-qa="salary"]').value;
  const office = form.querySelector('[data-qa="office"]').value;

  let isValid = true;
  let message = '';

  if (name.trim().length < 4) {
    message = 'Name value has less than 4 letters';
    isValid = false;
  } else if (position.trim().length === 0) {
    message = 'Position value is invalid';
    isValid = false;
  } else if (age < 18 || age > 90) {
    message = 'Age value is less than 18 or more than 90';
    isValid = false;
  }

  if (!isValid) {
    document.body.append(createNotification(message, 'error'));
  } else {
    document.body.append(
      createNotification('Employee successfully added', 'success'),
    );

    const newPerson = [
      name.trim(),
      position.trim(),
      office,
      age,
      `$${(+(salary / 1000)).toFixed(3).replace('.', ',')}`,
    ];

    const newRow = tbody.insertRow(-1);

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

// eslint-disable-next-line no-shadow
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  let editedCell = cell.textContent;

  cell.innerHTML = `<input class='cell-input' value='${editedCell}' />`;

  const input = e.target.querySelector('.cell-input');

  input.focus();

  // eslint-disable-next-line no-shadow
  const saveChanges = (e) => {
    if (e.type === 'blur' || (e.type === 'keyup' && e.key === 'Enter')) {
      const newText = e.target.value.trim() || editedCell;

      cell.innerText = newText;
      editedCell = null;
    }
  };

  input.addEventListener('blur', saveChanges);
  input.addEventListener('keyup', saveChanges);
});
