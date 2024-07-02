'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];

const form = document.createElement('form');

form.classList.add('new-employee-form');

const formLabels = [
  {
    text: 'Name',
    type: 'text',
    dataQa: 'name',
  },
  {
    text: 'Position',
    type: 'text',
    dataQa: 'position',
  },
  {
    text: 'Office',
    type: 'select',
    dataQa: 'office',
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
    text: 'Age',
    type: 'number',
    dataQa: 'age',
  },
  {
    text: 'Salary',
    type: 'number',
    dataQa: 'salary',
  },
];

formLabels.forEach(({ text, type, dataQa, options }) => {
  const label = document.createElement('label');
  const input =
    type === 'select'
      ? document.createElement('select')
      : document.createElement('input');

  if (type !== 'select') {
    input.type = type;
  }

  input.name = dataQa;
  input.setAttribute('data-qa', dataQa);

  if (type === 'select') {
    options.forEach((option) => {
      const optionElement = document.createElement('option');

      optionElement.value = option;
      optionElement.textContent = option;
      input.appendChild(optionElement);
    });
  }

  label.textContent = `${text}: `;
  label.appendChild(input);
  form.appendChild(label);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const nameEmployee = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = formData.get('salary');

  if (!nameEmployee.trim().length) {
    createNotification('Invalid Name', 'Name is required', 'error');

    return;
  }

  if (nameEmployee.trim().length < 4) {
    createNotification(
      'Invalid Name',
      'Name should be at least 4 characters long.',
      'error',
    );

    return;
  }

  if (!position.trim().length) {
    createNotification('Invalid Position', 'Position is required', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    createNotification(
      'Invalid Age',
      'Age should be between 18 and 90.',
      'error',
    );

    return;
  }

  if (!salary.trim().length) {
    createNotification('Invalid Salary', 'Salary is required', 'error');

    return;
  }

  const newRow = document.createElement('tr');
  const salaryFormatted = `$${parseFloat(salary).toLocaleString('en-US')}`;

  newRow.innerHTML = `
    <td>${nameEmployee}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salaryFormatted}</td>
  `;

  tbody.appendChild(newRow);
  e.target.reset();
  createNotification('Success', 'New employee added to the table.', 'success');

  addEditingFunctionality(newRow);
});

function createNotification(title, description, type) {
  const existingNotifications = document.querySelectorAll(
    '[data-qa="notification"]',
  );

  existingNotifications.forEach((notification) => notification.remove());

  const notificationElement = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  notificationElement.dataset.qa = 'notification';
  notificationElement.classList.add('notification', type);
  titleElement.classList.add('title');
  titleElement.textContent = title;
  descriptionElement.textContent = description;

  notificationElement.appendChild(titleElement);
  notificationElement.appendChild(descriptionElement);
  document.body.appendChild(notificationElement);

  setTimeout(() => {
    notificationElement.style.visibility = 'hidden';
  }, 2000);
}

const saveChanges = (input, initialValue) => {
  if (input) {
    const newValue = input.value.trim();

    if (newValue === '') {
      input.parentNode.textContent = initialValue;
    } else {
      input.parentNode.textContent = newValue;
    }
    input.remove();
  }
};

const sortOrder = {};
const sortTable = (columnIndex, sortBy) => {
  const rowsForSort = [...tbody.querySelectorAll('tr')];

  rowsForSort.sort((row1, row2) => {
    const value1 = row1.children[columnIndex].textContent;
    const value2 = row2.children[columnIndex].textContent;

    switch (sortBy) {
      case 'Name':
      case 'Position':
      case 'Office':
        return value1.localeCompare(value2) * sortOrder[columnIndex];
      case 'Age':
        return (value1 - value2) * sortOrder[columnIndex];
      case 'Salary':
        const salary1 = parseFloat(value1.replace(/[$,]/g, ''));
        const salary2 = parseFloat(value2.replace(/[$,]/g, ''));

        return (salary1 - salary2) * sortOrder[columnIndex];
      default:
        return 0;
    }
  });
  rowsForSort.forEach((row) => tbody.appendChild(row));
};

table.querySelectorAll('th').forEach((th, index) => {
  th.addEventListener('click', () => {
    const sortBy = th.textContent;

    sortOrder[index] = sortOrder[index] === 1 ? -1 : 1;
    sortTable(index, sortBy);
  });
});

function addEditingFunctionality(row) {
  row.addEventListener('click', () => {
    rows.forEach((r) => {
      r.classList.remove('active');
    });
    row.classList.add('active');
  });

  const cells = row.querySelectorAll('td');

  cells.forEach((cell) => {
    let cellInput = null;
    const initialValue = cell.textContent;

    cell.addEventListener('dblclick', () => {
      if (cellInput) {
        saveChanges(cellInput, initialValue);
        cellInput = null;
      } else {
        const input = document.createElement('input');

        input.value = initialValue;
        input.classList.add('cell-input');
        cell.textContent = '';
        cell.appendChild(input);
        input.focus();
        cellInput = input;

        input.addEventListener('blur', () => {
          saveChanges(input, initialValue);
          cellInput = null;
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            saveChanges(input, initialValue);
            cellInput = null;
          }
        });
      }
    });
  });
}

rows.forEach(addEditingFunctionality);
