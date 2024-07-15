'use strict';

const tableHead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let rows = [...tbody.rows];
let sortColumn = null;
let sortOrder = 'asc';

const addRow = (empName, empPosition, empOffice, empAge, empSalary) => {
  const newPerson = [
    empName.trim(),
    empPosition.trim(),
    empOffice,
    empAge,
    `$${(+(empSalary / 1000)).toFixed(3).replace('.', ',')}`,
  ];

  const newRow = tbody.insertRow(-1);

  newPerson.forEach((item, index) => {
    const cell = newRow.insertCell(index);

    cell.innerText = item;
  });

  rows = [...tbody.rows];
};

tableHead.addEventListener('click', (headerClickEvent) => {
  if (headerClickEvent.target.closest('th')) {
    const header = headerClickEvent.target.closest('th');
    const sortName = header.textContent;
    const cellIndex = headerClickEvent.target.closest('th').cellIndex;

    if (cellIndex === sortColumn) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = cellIndex;
      sortOrder = 'asc';
    }

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

    if (sortOrder === 'desc') {
      rows.reverse();
    }

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  }
});

let selectedRow = null;

tbody.addEventListener('click', (rowClickEvent) => {
  const row = rowClickEvent.target.closest('tr');
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
  '<label>Name: <input name="empName" data-qa="name" type="text"></label>';
const formPosition = `<label>Position: <input name="position" data-qa="position" type="text"></label>`;
const formCountry = `<label> Country: <select name="office" data-qa="office">${countries.map((country) => `<option value="${country}">${country}</option>`).join('')}</select></label>`;
const formAge = `<label>Age: <input name="age" data-qa="age" type="number"></label>`;
const formSalary = `<label>Salary: <input name="salary" data-qa="salary" type="number"></label>`;
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

  const description = document.createElement('h1');

  description.classList.add('title');
  description.textContent = text;
  notification.appendChild(description);

  return notification;
};

form.addEventListener('submit', (formSubmitEvent) => {
  formSubmitEvent.preventDefault();

  const empName = form.querySelector('[data-qa="name"]').value;
  const empPosition = form.querySelector('[data-qa="position"]').value;
  const empAge = form.querySelector('[data-qa="age"]').value;
  const empSalary = form.querySelector('[data-qa="salary"]').value;
  const empOffice = form.querySelector('[data-qa="office"]').value;

  let isValid = true;
  let message = '';

  if (empName.trim().length < 4) {
    message = 'Name value has less than 4 letters';
    isValid = false;
  } else if (empPosition.trim().length === 0) {
    message = 'Position value is invalid';
    isValid = false;
  } else if (empAge < 18 || empAge > 90) {
    message = 'Age value is less than 18 or more than 90';
    isValid = false;
  }

  if (!isValid) {
    document.body.append(createNotification(message, 'error'));
  } else {
    document.body.append(
      createNotification('Employee successfully added', 'success'),
    );
    addRow(empName, empPosition, empOffice, empAge, empSalary);
    form.reset();
  }

  setTimeout(() => {
    const notifications = document.querySelectorAll('.notification');

    notifications.forEach((notification) => {
      notification.parentNode.removeChild(notification);
    });
  }, 3000);
});

tbody.addEventListener('dblclick', (cellDblClickEvent) => {
  const cell = cellDblClickEvent.target;
  let editedCell = cell.textContent;

  cell.innerHTML = `<input class='cell-input' value='${editedCell}' />`;

  const input = cell.querySelector('.cell-input');

  input.focus();

  const saveChanges = (saveEvent) => {
    if (
      saveEvent.type === 'blur' ||
      (saveEvent.type === 'keyup' && saveEvent.key === 'Enter')
    ) {
      const newText = saveEvent.target.value.trim() || editedCell;

      cell.innerText = newText;
      editedCell = null;
    }
  };

  input.addEventListener('blur', saveChanges);
  input.addEventListener('keyup', saveChanges);
});
