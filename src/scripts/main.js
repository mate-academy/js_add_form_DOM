'use strict';

const DESC = 'desc';
const ASC = 'asc';
const HEADERS = ['name', 'position', 'office', 'age', 'salary'];
const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const DELAY_NOTIFICATION = 2000;

function mapTableRowsToObjects(collection) {
  return [...collection].map((item) => {
    const data = item.querySelectorAll('td');

    return HEADERS.reduce(
      (prev, current, index) => ({
        ...prev,
        [current]: data[index].innerText,
      }),
      {},
    );
  });
}

function createRow(item) {
  const row = document.createElement('tr');

  for (const key in item) {
    const rowData = document.createElement('td');

    rowData.innerText = item[key];
    row.appendChild(rowData);
  }

  return row;
}

function rebuildList(data) {
  const tableBody = document.querySelector('tbody');

  tableBody.innerHTML = '';

  for (const item of data) {
    const row = createRow(item);

    tableBody.appendChild(row);
  }
}

function sortItems(items, targetValue, order) {
  items.sort((a, b) => {
    if (targetValue === 'salary') {
      const aSalary = a[targetValue].slice(1).split(',').join('');
      const bSalary = b[targetValue].slice(1).split(',').join('');

      return order === ASC ? aSalary - bSalary : bSalary - aSalary;
    }

    if (targetValue === 'age') {
      return order === ASC
        ? a[targetValue] - b[targetValue]
        : b[targetValue] - a[targetValue];
    }

    return order === ASC
      ? a[targetValue].localeCompare(b[targetValue])
      : b[targetValue].localeCompare(a[targetValue]);
  });
}

function createSelectBox(title) {
  const selectBox = document.createElement('select');

  selectBox.name = title;
  selectBox.setAttribute('data-qa', title);
  selectBox.required = true;

  OFFICES.forEach((office) => {
    const option = document.createElement('option');

    option.value = office;
    option.innerText = office;
    selectBox.appendChild(option);
  });

  return selectBox;
}

function createInput(title) {
  const input = document.createElement('input');

  input.name = title;
  input.required = true;

  if (title === 'age' || title === 'salary') {
    input.type = 'number';
    input.min = 0;
  } else {
    input.type = 'text';
  }

  return input;
}

function createButton() {
  const button = document.createElement('button');

  button.type = 'submit';
  button.innerText = 'Save to table';

  return button;
}

function addForm() {
  const body = document.body;
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  for (const title of HEADERS) {
    const label = document.createElement('label');

    label.innerText = `${title[0].toUpperCase() + title.slice(1)}:`;

    if (title === 'office') {
      label.appendChild(createSelectBox(title));
      form.appendChild(label);
      continue;
    }

    label.appendChild(createInput(title));
    form.appendChild(label);
  }

  form.appendChild(createButton());
  body.appendChild(form);
}

const pushNotification = (title, description, type) => {
  const table = document.querySelector('table');

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;
  table.insertAdjacentElement('afterend', notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, DELAY_NOTIFICATION);
};

function isEmployeeDataValid(newName, age) {
  if (newName.length < 4) {
    pushNotification('Oops!', 'Name has less than 4 letters', 'error');

    throw new Error('Name has less than 4 letters');
  }

  if (+age <= 18 || +age > 90) {
    pushNotification('Oops!', 'Age is less than 18 or more than 90', 'error');

    throw new Error('Age is less than 18 or more than 90')
  }

  return true;
}

document.addEventListener('DOMContentLoaded', () => {
  const itemCollection = document.querySelectorAll('tbody tr');
  const tableHeader = document.querySelector('thead tr');
  const tableBody = document.querySelector('tbody');

  const items = mapTableRowsToObjects(itemCollection);

  tableHeader.addEventListener('click', (e) => {
    const title = e.target.closest('th');

    if (!title) {
      return;
    }

    const targetValue = title.innerText.toLowerCase();

    if (!title.hasAttribute('data-order') || title.dataset.order === DESC) {
      title.setAttribute('data-order', ASC);
    } else {
      title.setAttribute('data-order', DESC);
    }

    const order = title.dataset.order;

    sortItems(items, targetValue, order);
    rebuildList(items);
  });

  tableBody.addEventListener('click', (e) => {
    const activeRow = e.target.closest('tr');

    if (!activeRow) {
      return;
    }

    itemCollection.forEach((item) => {
      item.classList.remove('active');
    });

    activeRow.classList.add('active');
  });

  addForm();

  if (document.querySelector('.new-employee-form')) {
    const form = document.querySelector('.new-employee-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const newName = data.get('name');
      const age = data.get('age');

      // tranform salary into format '10,000,000,000'
      const salary = parseInt(data.get('salary')).toLocaleString('en-US');

      if (isEmployeeDataValid(newName, age)) {
        const newEmployee = {
          name: newName,
          position: data.get('position'),
          office: data.get('office'),
          age,
          salary: '$' + salary,
        };

        items.push(newEmployee);
        rebuildList(items);

        pushNotification(
          'Success!',
          'New employee has added to list.',
          'success',
        );
      } else {
        throw new Error('You can\'n create new employee');
      }
    });
  }
});
