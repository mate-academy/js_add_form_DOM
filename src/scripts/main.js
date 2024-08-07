'use strict';

const table = document.querySelector('table');
const tableHeader = document.querySelector('thead tr');
const tableBody = document.querySelector('tbody');
const offices = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];

table.insertAdjacentHTML('afterend', `
  <form method="/" action="GET" class="new-employee-form">
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>
    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>
    <label>Office:
      <select name="office" type="text" data-qa="office">
        <option selected disabled></option>
        ${createSelectList()}
      </select>
    </label>
    <label>Age:
      <input name="age" type="number" data-qa="age">
    </label>
    <label>Salary:
      <input name="salary" type="number" data-qa="salary">
    </label>
    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');

let isSortedColumn = null;

function sortColumns(a, b) {
  if (a.includes('$')) {
    return a.slice(1).replace(',', '') - b.slice(1).replace(',', '');
  }

  if (+a) {
    return a - b;
  }

  return a.localeCompare(b);
}

tableHeader.addEventListener('click', e => {
  const indexColumn = [...tableHeader.children].findIndex(el =>
    el === e.target
  );

  if (isSortedColumn !== e.target) {
    const ASC = [...tableBody.children].sort((a, b) => {
      const start = a.children[indexColumn].textContent;
      const end = b.children[indexColumn].textContent;

      return sortColumns(start, end);
    });

    tableBody.append(...ASC);
    isSortedColumn = e.target;

    return;
  }

  if (isSortedColumn === e.target) {
    const DESC = [...tableBody.children].sort((a, b) => {
      const start = a.children[indexColumn].textContent;
      const end = b.children[indexColumn].textContent;

      return sortColumns(end, start);
    });

    tableBody.append(...DESC);
    isSortedColumn = null;
  }
});

let previosTargetRow = null;

tableBody.addEventListener('click', e => {
  const selectedRow = e.target.closest('tr');

  if (previosTargetRow) {
    previosTargetRow.classList.remove('active');
  }

  if (previosTargetRow === selectedRow) {
    previosTargetRow.classList.remove('active');
    previosTargetRow = null;

    return;
  }

  previosTargetRow = selectedRow;

  selectedRow.classList.add('active');
});

function createSelectList() {
  return `${offices.map(office => `<option>${office}</option>`).join('')}`;
}

function convertSalary(salary) {
  return `$${(+salary).toLocaleString('en-US')}`;
}

function validData(key, value, data) {
  if (key === 'name') {
    if (value.trim().length < 4) {
      return pushNotification(450, 'error',
        'The "Name" must contain more than 4 letters', 'error');
    }

    if ([...value].find(
      x => x.toUpperCase() === x.toLowerCase() && x !== ' '
    )) {
      return pushNotification(450, 'error',
        'Invalid data, please use letters in "Name" field', 'error');
    }
  }

  if (key === 'position') {
    if (value.trim().length === 0) {
      return pushNotification(450, 'error',
        'The "Position" is empty', 'error');
    }

    if ([...value].find(
      x => x.toUpperCase() === x.toLowerCase() && x !== ' '
    )) {
      return pushNotification(450, 'error',
        'Invalid data, please use letters in "Position" field', 'error');
    }
  }

  if (data !== undefined) {
    if (!('office' in data)) {
      if (value.length === 0) {
        return pushNotification(450, 'error',
          'The "Office" is not selected', 'error');
      }
    }
  }

  if (key === 'age') {
    if (value < 18 || value > 90) {
      return pushNotification(450, 'error',
        'The age must be more than 18 and less than 90', 'error');
    }
  }

  if (key === 'salary') {
    if (+value.slice(1) <= 0) {
      return pushNotification(450, 'error',
        'The "Salary" is empty', 'error');
    }
  }

  return true;
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const newEmployee = document.createElement('tr');
  const data = new FormData(form);
  const formValues = Object.fromEntries(data.entries());

  formValues.salary = convertSalary(formValues.salary);

  const values = [...Object.values(formValues)];

  for (const key in formValues) {
    if (validData(key, formValues[key], formValues) !== true) {
      return;
    }
  }

  newEmployee.innerHTML = `
    ${values.map(value => `<td>${value.trim()}</td>`).join('')}
  `;

  tableBody.append(newEmployee);

  pushNotification(10, 'success',
    'The data has been added successfully', 'success');
  form.reset();
});

function pushNotification(posTop, title, description, type) {
  if (document.body.contains(document.querySelector('.notification'))) {
    document.querySelector('.notification').remove();
  }

  const notification = document.createElement('div');
  const heading = document.createElement('h2');
  const message = document.createElement('p');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  heading.classList.add('title');

  heading.textContent = title;
  message.textContent = description;

  notification.append(heading);
  notification.append(message);
  document.body.append(notification);

  notification.style.top = `${posTop}px`;

  setTimeout(() => {
    notification.remove();
  }, 5000);
};

const nameColumn = {
  0: 'name',
  1: 'position',
  2: 'office',
  3: 'age',
  4: 'salary',
};

tableBody.addEventListener('dblclick', e => {
  if (document.querySelector('.cell-input')) {
    return;
  }

  const selectedCell = e.target.closest('td');
  const textCell = selectedCell.textContent;

  selectedCell.textContent = '';

  const findIndex = [...e.target.closest('tr').children].findIndex(x =>
    x === e.target.closest('td')
  );

  if (findIndex === 2) {
    const select = document.createElement('select');

    select.classList.add('cell-input');
    selectedCell.append(select);

    select.innerHTML = `
      ${createSelectList()}
    `;

    select.addEventListener('blur', () => {
      selectedCell.textContent = select.value;
    });

    select.addEventListener('keydown', ev => {
      if (ev.code === 'Enter') {
        select.blur();
      }
    });
  } else {
    const input = document.createElement('input');

    input.classList.add('cell-input');
    selectedCell.append(input);
    input.focus();

    if (findIndex > 2) {
      input.type = 'number';
    }

    input.addEventListener('blur', () => {
      let text = input.value.trim();

      if (findIndex === 4) {
        text = convertSalary(text);
      }

      if (validData(nameColumn[findIndex], text) !== true) {
        selectedCell.textContent = textCell;

        return;
      }

      selectedCell.textContent = text;

      pushNotification(
        10, 'success', 'The data has been successfully changed', 'success'
      );
    });

    input.addEventListener('keydown', ev => {
      if (ev.code === 'Enter') {
        input.blur();
      }
    });
  }
});
