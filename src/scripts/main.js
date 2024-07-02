'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

let currentSortColumn = -1;
let selectedRow = null;

function sortTableByIndex(index, reversed) {
  const sorted = Array.from(tbody.children).sort((child1, child2) => {
    const value1 = child1.children[index].textContent;
    const value2 = child2.children[index].textContent;

    if (!isNaN(normalizedParseInt(value1))) {
      return normalizedParseInt(value1) - normalizedParseInt(value2);
    }

    return child1.children[index].textContent.localeCompare(
      child2.children[index].textContent,
    );
  });

  if (reversed) {
    sorted.reverse();
  }

  tbody.replaceChildren(...sorted);
}

thead.addEventListener('click', (e) => {
  const columnIndex = Array.from(thead.firstElementChild.children).indexOf(
    e.target,
  );

  sortTableByIndex(columnIndex, columnIndex === currentSortColumn);

  currentSortColumn = columnIndex === currentSortColumn ? -1 : columnIndex;
});

tbody.addEventListener('click', (e) => {
  const tableRow = e.target.closest('tr');

  if (!tableRow) {
    return;
  }

  if (selectedRow) {
    selectedRow.classList.remove('active');

    if (tableRow === selectedRow) {
      selectedRow = null;

      return;
    }

    selectedRow = null;
  }

  tableRow.classList.add('active');

  selectedRow = tableRow;
});

tbody.addEventListener('dblclick', (e) => {
  const originalContent = e.target.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.style.width = getComputedStyle(e.target).width;
  input.value = originalContent;

  const closeInput = () => {
    if (input.value === '') {
      e.target.textContent = originalContent;

      return;
    }

    e.target.textContent = input.value;

    input.remove();
  };

  input.addEventListener('blur', closeInput);

  input.addEventListener('keypress', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      closeInput();
    }
  });

  e.target.replaceChildren(input);
  input.focus();
});

function normalizedParseInt(value) {
  return parseInt(value.replaceAll('$', '').replaceAll(',', ''));
}

function capitalize(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}

function convertToSalary(salary) {
  return `$${salary.toLocaleString('en-US')}`;
}

function addEmployee(employee) {
  const values = Object.values(employee);

  const tr = document.createElement('tr');

  for (let i = 0; i < values.length; i++) {
    const td = document.createElement('td');

    td.textContent = values[i];

    tr.append(td);
  }

  tbody.append(tr);
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  notification.classList.add(`notification`);
  notification.classList.add(type);
  titleElement.classList.add('title');

  titleElement.textContent = title;
  descriptionElement.textContent = description;

  notification.append(titleElement, descriptionElement);

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.dataset.qa = 'notification';

  document.body.append(notification);

  setTimeout(() => {
    notification.style.visibility = 'hidden';
  }, 2000);
}

function handleSubmit(e) {
  e.preventDefault();

  const employeeName = e.target.name.value;
  const employeePosition = e.target.position.value;
  const employeeOffice = e.target.office.value;
  const employeeAge = parseInt(e.target.age.value);
  const employeeSalary = parseInt(e.target.salary.value);

  if (
    employeeName.trim().length === 0 ||
    employeePosition.trim().length === 0
  ) {
    pushNotification(
      10,
      10,
      'Error!',
      'Some of values contains only spaces.',
      'error',
    );

    return;
  }

  if (employeePosition.length === 0) {
    pushNotification(
      10,
      10,
      'Error!',
      'You need to enter employee position.',
      'error',
    );

    return;
  }

  if (employeeName.length < 4) {
    pushNotification(
      10,
      10,
      'Error!',
      'Your employee name length is less than 4.',
      'error',
    );

    return;
  }

  if (employeeAge < 18) {
    pushNotification(
      10,
      10,
      'Error!',
      'Your employee has to be older than 18.',
      'error',
    );

    return;
  }

  if (employeeAge > 90) {
    pushNotification(
      10,
      10,
      'Error!',
      'Your employee has to be younger than 90.',
      'error',
    );

    return;
  }

  addEmployee({
    name: employeeName,
    position: employeePosition,
    office: employeeOffice,
    age: employeeAge,
    salary: convertToSalary(employeeSalary),
  });

  pushNotification(
    10,
    10,
    'Added new employee',
    'Your new employee was added to the table!',
    'success',
  );

  e.target.reset();
}

function addForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const inputsToCreate = [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'position',
      type: 'text',
    },
    {
      name: 'office',
      type: 'select',
      options: [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ],
    },
    {
      name: 'age',
      type: 'number',
    },
    {
      name: 'salary',
      type: 'number',
    },
  ];

  for (const inputToCreate of inputsToCreate) {
    const label = document.createElement('label');

    label.textContent = `${capitalize(inputToCreate.name)}: `;

    if (inputToCreate.type === 'select') {
      const select = document.createElement('select');

      select.name = inputToCreate.name;
      select.dataset.qa = inputToCreate.name;
      select.required = true;

      for (const optionValue of inputToCreate.options) {
        const option = document.createElement('option');

        option.value = optionValue;
        option.textContent = optionValue;

        select.append(option);
      }

      label.append(select);
    } else {
      const input = document.createElement('input');

      input.name = inputToCreate.name;
      input.dataset.qa = inputToCreate.name;
      input.type = inputToCreate.type;
      input.required = true;

      label.append(input);
    }

    form.append(label);
  }

  const button = document.createElement('button');

  button.textContent = 'Save to table';

  form.append(button);

  document.body.append(form);

  form.addEventListener('submit', handleSubmit);
}

addForm();
