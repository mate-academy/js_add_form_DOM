'use strict';

const table = document.querySelector('table');
const tableHead = table.tHead;
const tableBody = table.tBodies[0];
const columns = [...tableHead.rows[0].cells];
const rows = [...tableBody.rows];

const body = document.querySelector('body');
const form = document.createElement('form');

const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelOffice = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');

const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const officeSelect = document.createElement('select');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');

const submitButton = document.createElement('button');

let sortedColumn = null;
let activeRow = null;

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function parseNumber(value) {
  return +value.replace(/\D/g, '');
}

function parseCurrency(value) {
  return '$' + value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function sortByColumn(column) {
  const columnIndex = columns.indexOf(column);

  rows.sort((rowA, rowB) => {
    const { textContent: cellA } = rowA.cells[columnIndex];
    const { textContent: cellB } = rowB.cells[columnIndex];

    switch (column.textContent) {
      case 'Name':
      case 'Position':
      default:
        return cellA.localeCompare(cellB);

      case 'Age':
      case 'Salary':
        return parseNumber(cellA) - parseNumber(cellB);
    }
  });

  return column;
}

function handleColumnSort(column) {
  column.addEventListener('click', () => {
    if (sortedColumn === column) {
      rows.reverse();
    } else {
      sortedColumn = sortByColumn(column);
    }

    tableBody.append(...rows);
  });
}

function handleRowSelect(row) {
  row.addEventListener('click', () => {
    row.classList.toggle('active');

    if (activeRow && activeRow !== row) {
      activeRow.classList.remove('active');
    }

    activeRow = !activeRow || activeRow !== row ? row : null;
  });
}

function appendOptions(select, options) {
  options.forEach((officeSelectOption) => {
    const option = document.createElement('option');

    option.value = officeSelectOption;
    option.textContent = officeSelectOption;

    select.append(option);
  });
}

function configureInput(input) {
  input.origin.name = input.name;
  input.origin.dataset.qa = input['data-qa'];

  if (input.type === 'select') {
    appendOptions(inputs[2].origin, inputs[2].options);
  } else {
    input.origin.type = input.type;
  }
}

function validateInput(input) {
  input.value = input.value.trim();

  switch (input.name) {
    case nameInput.name: {
      if (input.value.length < 4) {
        showNotification('error', 'Name must contain at least 4 letters');

        return false;
      }

      break;
    }

    case positionInput.name: {
      if (input.value.length < 4) {
        showNotification('error', 'Possition must contain at least 4 letters');

        return false;
      }

      break;
    }

    case ageInput.name: {
      if (input.value < 18 || input.value > 80) {
        showNotification('error', 'Age must be between 18 and 80 inclusively');

        return false;
      }

      break;
    }

    default:
      break;
  }

  return true;
}

function showNotification(type, message) {
  const div = document.createElement('div');
  const span = document.createElement('span');

  div.classList.add('notification', type);
  div.dataset.qa = 'notification';

  span.classList.add('title');
  span.textContent = message;

  div.append(span);
  body.append(div);

  setTimeout(() => div.remove(), 5000);
}

function handleCellDoubleClick(cell) {
  const { textContent: text, cellIndex } = cell;
  const input = document.createElement(
    cell.cellIndex === 2 ? 'select' : 'input',
  );
  let isEditing = false;

  const handleCellEdit = () => {
    if (isEditing) {
      return;
    }

    isEditing = true;

    if (!input.value) {
      input.remove();
      cell.textContent = input.type === 'salary' ? parseCurrency(text) : text;
    }

    if (validateInput(input)) {
      input.remove();

      cell.textContent =
        input.name === 'salary' ? parseCurrency(input.value) : input.value;
    }

    isEditing = false;
  };

  input.classList.add('cell-input');
  input.name = inputs[cellIndex].name;

  if (inputs[cellIndex].type === 'select') {
    appendOptions(input, inputs[cellIndex].options);
  } else {
    input.type = inputs[cellIndex].type;
  }

  input.value = input.name === 'salary' ? parseNumber(text) : text;

  input.addEventListener('blur', (blurEvent) => {
    blurEvent.preventDefault();
    handleCellEdit();
  });

  input.addEventListener('keypress', (inputEvent) => {
    if (inputEvent.key === 'Enter') {
      inputEvent.preventDefault();
      handleCellEdit();
    }
  });

  cell.textContent = '';
  cell.append(input);
  input.focus();
}

function handleFormSubmit(e) {
  e.preventDefault();

  const notification = body.querySelector('.notification');

  if (notification) {
    notification.remove();
  }

  for (let i = 0; i < form.elements.length - 1; i++) {
    const input = form[i];

    if (!input.value) {
      return showNotification('error', `${capitalize(input.name)} is required`);
    }

    if (!validateInput(input)) {
      return;
    }
  }

  const tableRow = document.createElement('tr');

  for (let i = 0; i < form.elements.length - 1; i++) {
    const input = form[i];
    const tableData = document.createElement('td');
    let textContent = input.value;

    tableData.textContent = textContent;

    if (input === salaryInput) {
      tableData.textContent = tableData.textContent.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ',',
      );
    }

    if (input.name === salaryInput.name) {
      textContent = parseCurrency(input.value);
    }

    tableData.textContent = textContent;
    tableRow.append(tableData);
  }

  tableBody.append(tableRow);
  form.reset();

  return showNotification(
    'success',
    'New employee is successfully added to the table',
  );
}

const inputs = [
  {
    name: 'name',
    type: 'text',
    'data-qa': 'name',
    origin: nameInput,
  },
  {
    name: 'position',
    type: 'text',
    'data-qa': 'position',
    origin: positionInput,
  },
  {
    name: 'office',
    type: 'select',
    'data-qa': 'office',
    origin: officeSelect,
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
    'data-qa': 'age',
    origin: ageInput,
  },
  {
    name: 'salary',
    type: 'number',
    'data-qa': 'salary',
    origin: salaryInput,
  },
];

columns.forEach(handleColumnSort);
rows.forEach(handleRowSelect);
inputs.forEach(configureInput);

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';

labelName.append(capitalize(nameInput.name), nameInput);
labelPosition.append(capitalize(positionInput.name), positionInput);
labelOffice.append(capitalize(officeSelect.name), officeSelect);
labelAge.append(capitalize(ageInput.name), ageInput);
labelSalary.append(capitalize(salaryInput.name), salaryInput);

form.classList.add('new-employee-form');

form.append(
  labelName,
  labelPosition,
  labelOffice,
  labelAge,
  labelSalary,
  submitButton,
);

form.addEventListener('submit', handleFormSubmit);

body.append(form);

tableBody.addEventListener('dblclick', (cellEvent) => {
  cellEvent.preventDefault();

  if (cellEvent.target.tagName === 'TD') {
    handleCellDoubleClick(cellEvent.target);
  }
});
