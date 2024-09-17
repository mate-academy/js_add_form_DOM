'use strict';

const COLUMNS = {
  NAME: 0,
  POSITION: 1,
  OFFICE: 2,
  AGE: 3,
  SALARY: 4,
};

// #region utils
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const formatSalary = (salary) => {
  return parseInt(salary.slice(1).replace(/,/g, ''));
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// #endregion

// DOM elements selection
const body = document.body;
const tableElement = document.querySelector('table');
const tbody = tableElement.querySelector('tbody');
const headers = tableElement.querySelectorAll('thead th');

// #region Sort table
let isDescOrder = false;
let currentSortField = null;

function setSortOrder(newSortField) {
  if (currentSortField !== null && currentSortField === newSortField) {
    isDescOrder = !isDescOrder;
  } else {
    isDescOrder = false;
    currentSortField = newSortField;
  }
}

function sortTable(column) {
  setSortOrder(column);

  const rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    const aValue = a.cells[column].textContent;
    const bValue = b.cells[column].textContent;

    const order = isDescOrder ? -1 : 1;

    switch (column) {
      case COLUMNS.AGE:
        return order * (parseInt(aValue) - parseInt(bValue));

      case COLUMNS.SALARY:
        return order * (formatSalary(aValue) - formatSalary(bValue));

      default:
        return order * aValue.localeCompare(bValue);
    }
  });

  tbody.innerHTML = '';

  rows.forEach(row => {
    tbody.appendChild(row);
  });
}
// #endregion

// #region Select table row
let selectedRow = null;

function selectTableRow(e) {
  const tableRow = e.target.closest('tr');

  if (!tableRow || !tbody.contains(tableRow)) {
    return;
  }

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  tableRow.classList.add('active');
  selectedRow = tableRow;
}
// #endregion

// #region Create form
const formFields = [
  {
    name: 'name',
    type: 'text',
    tagName: 'input',
  },
  {
    name: 'position',
    type: 'text',
    tagName: 'input',
  },
  {
    name: 'office',
    tagName: 'select',
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
    tagName: 'input',
  },
  {
    name: 'salary',
    type: 'number',
    tagName: 'input',
  },
];

function createFormField(field) {
  const { name: fieldName, type, tagName, options } = field;
  const formField = document.createElement('label');

  formField.textContent = capitalize(fieldName) + ':';

  const formFieldContent = document.createElement(tagName);

  formFieldContent.setAttribute('data-qa', fieldName);
  formFieldContent.setAttribute('name', fieldName);

  if (field.tagName === 'input') {
    formFieldContent.type = type;
  } else {
    for (const option of options) {
      const newOptionElement = document.createElement('option');

      newOptionElement.value = option;
      newOptionElement.textContent = option;

      formFieldContent.appendChild(newOptionElement);
    }
  }

  formField.appendChild(formFieldContent);

  return formField;
}

const formElement = document.createElement('form');

formElement.classList.add('new-employee-form');

for (const field of formFields) {
  const formFieldElement = createFormField(field);

  formElement.appendChild(formFieldElement);
}

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';

formElement.appendChild(submitButton);

body.appendChild(formElement);
// #endregion

// #region Handle form submit
function createNewEmployee(formData) {
  const tableRow = document.createElement('tr');

  for (const [key, value] of Object.entries(formData)) {
    const tableData = document.createElement('td');

    let data = value;

    if (key === 'salary') {
      data = '$' + formatNumber(data);
    }

    tableData.textContent = data;

    tableRow.appendChild(tableData);
  }

  return tableRow;
}

function addNewEmployee(e) {
  e.preventDefault();

  const form = e.target;
  const formData = Object.fromEntries(new FormData(form));

  const errors = getErrors(formData);

  if (!errors.length) {
    const newEmployee = createNewEmployee(formData);

    tbody.appendChild(newEmployee);
    form.reset();

    pushNotification(10, 10, 'Success', 'New employee was created', 'success');

    return;
  }

  for (const [index, { title, description }] of errors.entries()) {
    pushNotification(10 + (index * 130), 10, title, description, 'error');
  }
}

formElement.addEventListener('submit', (e) => addNewEmployee(e));
// #endregion

// #region Validate form
function getErrors(formData) {
  const { name: fieldName, position, office, age, salary } = formData;
  const errors = [];

  if (!fieldName || !position || !office || !age || !salary) {
    errors.push({
      title: 'All fields are required',
      description: 'Please fill all fields',
    });

    return errors;
  }

  if (fieldName.length < 4) {
    errors.push({
      title: 'Name is too short',
      description: 'Name has to be at least 4 characters',
    });
  }

  if (age < 18 || age > 90) {
    errors.push({
      title: 'Wrong age',
      description: 'Age has to be between 18 and 90 years old',
    });
  }

  return errors;
}
// #endregion

// #region Create notifications
function pushNotification(posTop, posRight, title, description, type) {
  const messageElement = document.createElement('div');

  messageElement.className = `notification ${type}`;
  messageElement.style.cssText = `top: ${posTop}px; right: ${posRight}px`;
  messageElement.setAttribute('data-qa', 'notification');

  const titleElement = document.createElement('h2');

  titleElement.classList.add('title');
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;

  messageElement.appendChild(titleElement);
  messageElement.appendChild(descriptionElement);

  document.body.appendChild(messageElement);

  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 2000);
}
// #endregion

// #region Edit table
function getInputErrors(value, columnIndex) {
  const errors = [];

  switch (columnIndex) {
    case COLUMNS.NAME:
      if (value.length < 4) {
        errors.push({
          title: 'Name is too short',
          description: 'Name has to be at least 4 characters',
        });
      }
      break;

    case COLUMNS.AGE:
      if (value < 18 || value > 90) {
        errors.push({
          title: 'Wrong age',
          description: 'Age has to be between 18 and 90 years old',
        });
      }
      break;

    case COLUMNS.OFFICE:
      if (!formFields[COLUMNS.OFFICE].options.includes(value)) {
        errors.push({
          title: 'Wrong city',
          description: 'Office should be in one of the cities from the list',
        });
      }
      break;

    default:
      break;
  }

  return errors;
}

const getInputType = (data) => {
  const isNumber = !Number.isNaN(formatSalary(data)) || !Number.isNaN(+data);

  return isNumber ? 'number' : 'text';
};

const saveChanges = (tableData, prevValue, valueToChange) => {
  const newValue = valueToChange || prevValue;

  if (prevValue.startsWith('$')) {
    const newSalary = formatNumber(+newValue);

    if (isNaN(newSalary.slice(1))) {
      tableData.textContent = prevValue;

      return;
    }

    tableData.textContent = '$' + formatNumber(+newValue);

    return;
  }

  tableData.textContent = newValue;
};

const onBlur = (e, tableData, prevValue) => {
  const newValue = e.target.value;
  const columnIndex = tableData.cellIndex;

  const errors = getInputErrors(newValue, columnIndex);

  if (!errors.length || newValue === '') {
    saveChanges(tableData, prevValue, newValue);

    return;
  }

  for (const [index, { title, description }] of errors.entries()) {
    pushNotification(10 + (index * 130), 10, title, description, 'error');
  }

  tableData.textContent = prevValue;
};

const onKeyPress = (tableData, prevValue) => {
  tableData.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Enter') {
        onBlur(e, tableData, prevValue);
      }

      if (e.key === 'Escape') {
        tableData.textContent = prevValue;
      }
    },
  );
};

const changeToInput = (tableData) => {
  const value = tableData.textContent;

  const input = document.createElement('input');
  const inputType = getInputType(value);

  input.classList.add('cell-input');
  input.type = inputType;

  if (value.startsWith('$')) {
    input.value = formatSalary(value);
  } else {
    input.value = value;
  }

  tableData.innerHTML = '';

  tableData.appendChild(input);
  input.focus();

  input.addEventListener(
    'blur',
    (e) => onBlur(e, tableData, value),
    { once: true }
  );
};

function editTableData(e) {
  e.preventDefault();

  const targetItem = e.target;
  const table = e.currentTarget;
  const tableBody = table.querySelector('tbody');

  const tableData = targetItem.closest('td');

  if (!tableData || !tableBody.contains(tableData)) {
    return;
  }

  const prevValue = tableData.textContent;

  const dataInput = tableData.querySelector('.cell-input');

  if (!dataInput) {
    changeToInput(tableData);
  }

  onKeyPress(tableData, prevValue);
}
// #endregion

// Event listeners
headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    sortTable(columnIndex);
  });
});

tableElement.addEventListener('click', selectTableRow);
tableElement.addEventListener('dblclick', editTableData);
