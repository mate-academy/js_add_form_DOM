'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const theadRow = thead.querySelector('tr');
const nav = theadRow.querySelectorAll('th');

const tbody = document.querySelector('tbody');
let rows = [...tbody.querySelectorAll('tr')];

let count = 0;
let activeRow = null;

function convertToNumber(str) {
  const cleanStr = str
    .split('')
    .filter((ch) => (ch >= '0' && ch <= '9') || ch === '.')
    .join('');

  return parseFloat(cleanStr);
}

function updateRows() {
  rows = [...tbody.querySelectorAll('tr')];
}

function sortList(columnIndex, isReverse) {
  rows.sort((rowA, rowB) => {
    let value1 = rowA.querySelector(
      `td:nth-child(${columnIndex + 1})`,
    ).textContent;

    let value2 = rowB.querySelector(
      `td:nth-child(${columnIndex + 1})`,
    ).textContent;

    if (columnIndex === 3 || columnIndex === 4) {
      value1 = convertToNumber(value1);
      value2 = convertToNumber(value2);
    }

    if (isReverse) {
      [value1, value2] = [value2, value1];
    }

    return typeof value1 === 'string' && typeof value2 === 'string'
      ? value1.localeCompare(value2)
      : value1 - value2;
  });

  rows.forEach((row) => tbody.appendChild(row));
}

// #region --header nav event call & add 'active' to row--

nav.forEach((th, index) => {
  th.addEventListener('click', () => {
    count++;
    sortList(index, count % 2 === 0);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tbody tr');

  if (!row) {
    return;
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
  activeRow = row;
});

// #endregion

// #region -- create form--

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name" ></label>
<label>Position: <input name="position" type="text" data-qa="position" ></label>
<label>Office: <select name="office" data-qa="office" >
    <option value="Tokyo" selected>Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label>Age: <input name="age" type="number" data-qa="age" ></label>
<label>Salary: <input name="salary" type="number" data-qa="salary" ></label>
<button name="button" type="submit">Save to table</button>
`;

body.appendChild(form);
// #endregion

// #region --create notidicftion--

function pushNotification(type, titleText, descriptionText) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);
  notificationTitle.classList.add('title');

  notificationTitle.textContent = titleText;
  notificationDescription.textContent = descriptionText;

  notification.style.top = '70%';

  notification.append(notificationTitle, notificationDescription);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';
  }, 4000);
}

function pushSuccessNotification() {
  return pushNotification(
    'success',
    'Congratulation!',
    'Employee added successfully!',
  );
}

function pushErrorNotification(message) {
  return pushNotification('error', 'Error', message);
}

// #endregion

// #region --form event--

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = new FormData(form);
  const formName = data.get('name');
  const position = data.get('position');
  const office = form.querySelector('[name="office"]').value;
  const age = data.get('age');
  const salary = data.get('salary');

  const newRow = document.createElement('tr');

  // name
  const newName = document.createElement('td');

  newName.textContent = formName;

  if (formName === '') {
    pushErrorNotification('Please enter your name');

    return;
  }

  if (position === '') {
    pushErrorNotification('Please enter your position');

    return;
  }

  if (age.toString() === '') {
    pushErrorNotification('Please enter your age');

    return;
  }

  if (salary.toString() === '') {
    pushErrorNotification('Please enter your salary');

    return;
  }

  if (formName.length < 4) {
    pushErrorNotification('Name must be at least 4 letters');

    return;
  }
  newRow.appendChild(newName);

  // position
  const newPosition = document.createElement('td');

  newPosition.textContent = position;
  newRow.appendChild(newPosition);

  // office
  const newOffice = document.createElement('td');

  newOffice.textContent = office;
  newRow.appendChild(newOffice);

  // age
  const newAge = document.createElement('td');

  newAge.textContent = age;

  if (age < 18 || age > 90) {
    pushErrorNotification('Age must be between 18 and 90');

    return;
  }
  newRow.appendChild(newAge);

  const newSalary = document.createElement('td');
  const salaryToStr = salary
    .toString()
    .split('')
    .reverse()
    .map((num, index) => (index % 3 === 0 && index !== 0 ? `${num},` : num))
    .reverse()
    .join('');

  newSalary.textContent = `$${salaryToStr}`;
  newRow.appendChild(newSalary);

  tbody.appendChild(newRow);
  updateRows();
  pushSuccessNotification();
});
// #endregion

// #region --editing of table cells--

tbody.addEventListener('dblclick', (eve) => {
  const cell = eve.target.closest('td');
  const newInput = document.createElement('input');
  const cellIndex = Array.from(cell.parentElement.children).indexOf(cell) + 1;
  const currentValue = cell.textContent;

  if (!cell) {
    return;
  }

  newInput.textContent = '';

  if (cellIndex === 4 || cellIndex === 5) {
    newInput.setAttribute('type', 'number');
  } else {
    newInput.setAttribute('type', 'text');
  }

  newInput.classList.add('cell-input');
  newInput.value = currentValue;

  cell.textContent = '';
  cell.appendChild(newInput);

  newInput.addEventListener('blur', () => {
    let newValue = newInput.value.trim();

    if (cellIndex === 5) {
      newValue = `$${newInput.value
        .toString()
        .split('')
        .reverse()
        .map((num, index) => (index % 3 === 0 && index !== 0 ? `${num},` : num))
        .reverse()
        .join('')}`;
    }

    cell.textContent = newValue === '' ? currentValue : newValue;
  });

  newInput.addEventListener('keydown', (k) => {
    if (k.key === 'Enter') {
      newInput.blur();
    }
  });

  newInput.focus();
});

// #endregion
