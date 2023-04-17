'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];
const form = document.createElement('form');
let inputActive = false;
let textValue = '';

form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin', `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: 
    <input
      name="position"
      type="text"
      data-qa="position"
      required
    >
  </label>
  <label>Office: 
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>Salary: 
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button>Save to table</button>
`);

table.parentNode.insertBefore(form, table.nextSibling);

table.querySelectorAll('thead th').forEach((th, index) => {
  th.addEventListener('click', (ev) => {
    sortColumn(index, ev);
  });
});

function normalizeValue(el, index, isNumeric) {
  const value = el.cells[index].textContent.replace(/[$,]/g, '');

  return isNumeric ? +value : value;
}

function sortColumn(index, ev) {
  ev.target.setAttribute('data-direction',
    ev.target.getAttribute('data-direction')
  && ev.target.getAttribute('data-direction') === 'asc' ? 'desc' : 'asc');

  const direction = ev.target.getAttribute('data-direction');

  const isNumeric = !isNaN(normalizeValue(rows[0], index, true));

  rows.sort((a, b) => {
    const aValue = normalizeValue(a, index, isNumeric);
    const bValue = normalizeValue(b, index, isNumeric);

    return isNumeric
      ? (direction === 'asc' ? (aValue - bValue) : (bValue - aValue))
      : (direction === 'asc'
        ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue));
  });

  rows.forEach(row => {
    table.querySelector('tbody').append(row);
  });
}

rows.forEach(row => {
  row.addEventListener('click', () => {
    table.querySelector('.active')
    && table.querySelector('.active').classList.remove('active');
    row.classList.add('active');
  });
});

function showNotification(type, text) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h3');

  notification.classList.add('notification', `${type.toLowerCase()}`);
  notification.dataset.qa = 'notification';
  notificationTitle.textContent = type;
  notification.textContent = text;
  notification.prepend(notificationTitle);
  form.parentNode.insertBefore(notification, form.nextSibling);

  setTimeout(() => notification.remove(), 5000);
};

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  document.querySelector('.notification')
    && document.querySelector('.notification').remove();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (data.name.trim().length < 4) {
    showNotification('Error', 'Name must be at least 4 letters');

    return;
  }

  if (data.position.trim().length < 4) {
    showNotification('Error', 'Position must be at least 4 letters');

    return;
  }

  if (data.age < 18 || data.age > 90) {
    showNotification('Error', 'Age must be between 18 and 90');

    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(data.name)) {
    showNotification('Error',
      'Name must contain only Latin letters and spaces');

    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(data.position)) {
    showNotification('Error',
      'Position must contain only Latin letters and spaces');

    return;
  }

  const newRow = tbody.insertRow();

  Object.entries(data).forEach(([key, value]) => {
    const cell = newRow.insertCell();

    cell.textContent = key === 'salary'
      ? Number(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      })
      : value;
  });

  rows.push(newRow);
  showNotification('Success', 'Row is added to the table');

  form.reset();
});

table.addEventListener('dblclick', (ev) => {
  if (inputActive) {
    return;
  };

  const cell = ev.target.closest('td');
  const columnName = table.querySelector('thead tr')
    .children[cell.cellIndex].textContent.trim();

  if (!cell) {
    return;
  };

  const cellText = cell.textContent.trim();

  textValue = cellText;

  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');
  input.value = cellText;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    saveChanges(cell, input, columnName);
  });

  input.addEventListener('keydown', (occ) => {
    if (occ.key === 'Enter') {
      occ.preventDefault();
      saveChanges(cell, input, columnName);
    }
  });

  inputActive = true;
});

function saveChanges(cell, input, columnName) {
  let newText = input.value.trim();

  if (newText === '') {
    newText = textValue;
    showNotification('Error', 'No blank value is allowed');
  }

  const regex = {
    'Name': /^[a-zA-Z]+\s[a-zA-Z]+$/,
    'Position': /^[a-zA-Z\s]+$/,
    'Office': /^[a-zA-Z\s]+$/,
    'Age': /^\d+$/,
    'Salary': /^\$\d+(,\d{3})*(\.\d{2})?$/,
  };

  if (!regex[columnName].test(newText)) {
    newText = textValue;

    showNotification('Error',
      'Input editable values must match the data in the table');
  }

  if (columnName === 'Age' && (newText < 18 || newText > 90)) {
    newText = textValue;
    showNotification('Error', 'Age must be between 18 and 90');
  }

  cell.textContent = newText;
  inputActive = false;
}
