'use strict';

const body = document.querySelector('body');
const form = document.createElement('form');
const button = document.createElement('button');

body.appendChild(form);
form.classList.add('new-employee-form');

const titlesList = document.querySelectorAll('thead th');

const tbody = document.querySelector('tbody');
let rows = Array.from(tbody.querySelectorAll('tr'));

addRowActive();

let order;
let lastIndex = -1;

titlesList.forEach((title, index) => {
  const label = document.createElement('label');

  form.appendChild(label);
  label.textContent = title.textContent + ':';

  const qaAtr = title.textContent.trim().toLowerCase();
  let inputType = 'text';

  if (index === 3 || index === 4) {
    inputType = 'number';
  }

  if (index !== 2) {
    const input = document.createElement('input');

    input.setAttribute('name', qaAtr);
    input.setAttribute('type', inputType);
    input.setAttribute('data-qa', qaAtr);

    if (index === 0 || index === 1) {
      input.setAttribute('required', '');
    }

    label.appendChild(input);
  } else {
    const select = document.createElement('select');

    select.setAttribute('name', qaAtr);
    select.setAttribute('data-qa', qaAtr);
    select.setAttribute('required', '');

    const options = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    options.forEach((option) => {
      const opt = document.createElement('option');

      opt.textContent = option;
      select.appendChild(opt);
    });
    label.appendChild(select);
  }

  form.appendChild(button);
  button.textContent = 'Save to table';

  title.addEventListener('click', () => {
    if (lastIndex !== index) {
      order = 'ASC';
    } else {
      order = order === 'ASC' ? 'DESC' : 'ASC';
    }
    lastIndex = index;

    switch (index) {
      case 0:
      case 1:
      case 2:
        sortTable(index, 'text', order);
        break;
      case 3:
      case 4:
        sortTable(index, 'number', order);
        break;
      default:
        break;
    }
    rows.forEach((row) => tbody.appendChild(row));
  });
});

function sortTable(columnIndex, dataType, sortOrder) {
  rows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[columnIndex].textContent.trim();
    const cellB = rowB.querySelectorAll('td')[columnIndex].textContent.trim();

    if (dataType === 'number') {
      return sortOrder === 'ASC'
        ? helper(cellA) - helper(cellB)
        : helper(cellB) - helper(cellA);
    } else {
      return sortOrder === 'ASC'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });
}

button.onclick = (e) => {
  e.preventDefault();

  const values = form.querySelectorAll('input, select');
  const formData = {};

  values.forEach((v) => {
    formData[v.name] = v.value.trim();
  });

  if (formData.name.length < 4) {
    pushNotification('Error', 'Name should be at least 4 characters.', 'error');

    return;
  }

  if (!formData.position) {
    pushNotification('Error', 'Position is required.', 'error');

    return;
  }

  const age = parseInt(formData.age, 10);

  if (isNaN(age) || age < 18 || age > 90) {
    pushNotification('Error', 'Age should be between 18 and 90.', 'error');

    return;
  }

  const salary = formData.salary;

  if (!/^\d+$/.test(salary)) {
    pushNotification('Error', 'Salary should be a valid number.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  Object.values(formData).forEach((data, index) => {
    const newCell = document.createElement('td');
    let v = data;

    if (index === 3) {
      v = Number(data);
    }

    if (index === 4) {
      v = `$${Number(data).toLocaleString('en-US')}`;
    }

    newCell.textContent = v;
    newRow.appendChild(newCell);
  });

  tbody.appendChild(newRow);

  pushNotification('Success', 'New employee added successfully.', 'success');

  form.reset();

  rows = Array.from(tbody.querySelectorAll('tr'));

  addRowActive();
};

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.setAttribute('data-qa', 'notification');

  const messageTitle = document.createElement('h2');

  messageTitle.className = 'title';
  messageTitle.textContent = title;

  const notification = document.createElement('p');

  notification.textContent = description;
  message.appendChild(messageTitle);
  message.appendChild(notification);

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
};

function addRowActive() {
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });
}

function helper(string) {
  return Number(string.replace(/[^0-9.-]+/g, ''));
}
