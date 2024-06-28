'use strict';

const body = document.querySelector('body');
const table = body.querySelector('table');
const validate = new Validator();
const tableColumns = ['name', 'position', 'office', 'age', 'salary'];
const officesList = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const editableCell = {
  cellInitialValue: '',
  cell: null,
};
const tableDataSortingInfo = {
  column: '',
  sortingType: '',
};

const employeeForm = body.appendChild(
  createNewEmployeeForm(tableColumns, officesList),
);

employeeForm.addEventListener('click', handleFormSubmit);
table.addEventListener('click', handleTableClick);
table.addEventListener('dblclick', handleTableDoubleClick);
table.addEventListener('blur', handleTableBlur, true);
table.addEventListener('keydown', handleCellKeyDown);

function handleFormSubmit(e) {
  e.preventDefault();

  if (e.target.matches('button')) {
    const validated = validateFormData(e.target, tableColumns, officesList);

    if (validated.status === false) {
      createNotificationElement('Error!', validated.validationErrors, 'error');
    } else {
      createNotificationElement(
        'Success!',
        ['Data added to the table!'],
        'success',
      );

      table.tBodies[0].append(createNewRow(validated.data, tableColumns));
      e.target.form.reset();
    }
  }
}

function handleTableClick(e) {
  if (e.target.matches('th')) {
    const sortingResult = tableSorting(e.target, table, tableDataSortingInfo);

    if (sortingResult && sortingResult.sortedRows) {
      tableDataSortingInfo.column = sortingResult.column;
      tableDataSortingInfo.sortingType = sortingResult.sortingType;

      for (const el of sortingResult.sortedRows) {
        table.tBodies[0].append(el);
      }
    }
  }

  if (e.target.parentElement.matches('tr')) {
    for (const row of table.tBodies[0].rows) {
      row.classList.remove('active');

      if (row === e.target.parentElement) {
        row.classList.add('active');
      }
    }
  }
}

function handleTableDoubleClick(e) {
  if (e.target.matches('td')) {
    editableCell.cellInitialValue = e.target.innerText;
    editableCell.cell = e.target;

    const cellInput = createCellInput(editableCell.cellInitialValue);

    e.target.replaceChildren(cellInput);
    cellInput.focus();
  }
}

function handleTableBlur(e) {
  if (e.target.classList.contains('cell-input')) {
    saveChanges(e.target);
  }
}

function handleCellKeyDown(e) {
  if (e.key === 'Enter' && e.target.classList.contains('cell-input')) {
    e.preventDefault();
    saveChanges(e.target);
  }
}

function tableSorting(targetColumn, tab, sortingInfo) {
  const tabBodyRows = Array.from(tab.tBodies[0].rows);
  const sortedColumn = sortingInfo.column;
  let typeOfSorting = sortingInfo.sortingType;

  const columnIndex = targetColumn.cellIndex;

  if (targetColumn.innerText === sortedColumn && typeOfSorting === 'ASC') {
    typeOfSorting = 'DESC';
  } else {
    typeOfSorting = 'ASC';
  }

  tabBodyRows.sort((a, b) => {
    const elFirst = a.children[columnIndex].innerText;
    const elSecond = b.children[columnIndex].innerText;

    const elFirstNumber = parseFloat(elFirst.replace(/[$,]/g, ''));
    const elSecondNumber = parseFloat(elSecond.replace(/[$,]/g, ''));

    if (!isNaN(elFirstNumber) && !isNaN(elSecondNumber)) {
      return typeOfSorting === 'ASC'
        ? elFirstNumber - elSecondNumber
        : elSecondNumber - elFirstNumber;
    }

    return typeOfSorting === 'ASC'
      ? elFirst.localeCompare(elSecond)
      : elSecond.localeCompare(elFirst);
  });

  return {
    column: targetColumn.innerText,
    sortingType: typeOfSorting,
    sortedRows: tabBodyRows,
  };
}

function saveChanges(input) {
  const cell = input.parentElement;
  let newValue = input.value.trim();
  const columnIndex = cell.cellIndex;
  const columnName = tableColumns[columnIndex];

  if (columnName === 'name' && !validate.extremumLength(newValue, 4)) {
    createNotificationElement(
      'Error!',
      [`Incorrect ${columnName} value!`],
      'error',
    );
    newValue = editableCell.cellInitialValue;
  }

  if (columnName === 'age') {
    if (!validate.extremumValue(+newValue, 18, 90) || isNaN(Number(newValue))) {
      createNotificationElement(
        'Error!',
        [`Incorrect ${columnName} value!`],
        'error',
      );
      newValue = editableCell.cellInitialValue;
    }
  }

  if (columnName === 'office' && !validate.oneOfMany(newValue, officesList)) {
    createNotificationElement(
      'Error!',
      [`Incorrect ${columnName} value!`],
      'error',
    );
    newValue = editableCell.cellInitialValue;
  }

  if (columnName === 'salary') {
    newValue = Number(newValue.replace(/[$,]/g, ''));

    if (isNaN(newValue)) {
      createNotificationElement(
        'Error!',
        [`Incorrect ${columnName} value!`],
        'error',
      );
      newValue = editableCell.cellInitialValue;
    } else {
      newValue = `$${newValue.toLocaleString('en-US')}`;
    }
  }

  cell.textContent = newValue || editableCell.cellInitialValue;
  editableCell.cell = null;
}

function createNewEmployeeForm(inputs, offices) {
  const form = document.createElement('form');

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.innerText = 'Save to table';

  const inputsElements = inputs.map((input) => {
    const label = document.createElement('label');
    const inputElement =
      input === 'office'
        ? document.createElement('select')
        : document.createElement('input');

    inputElement.name = input;
    inputElement.dataset.qa = input;

    if (input === 'age' || input === 'salary') {
      inputElement.type = 'number';

      if (input === 'age') {
        inputElement.min = 0;
        inputElement.max = 150;
      }
    } else if (input === 'office') {
      const defaultSelect = document.createElement('option');

      defaultSelect.innerText = '(select office)';
      defaultSelect.selected = true;

      const options = offices.map((office) => {
        const option = document.createElement('option');

        option.innerText = office;

        return option;
      });

      inputElement.append(defaultSelect, ...options);
    } else {
      inputElement.type = 'text';
    }

    label.innerText = input[0].toUpperCase() + input.slice(1);
    label.append(inputElement);

    return label;
  });

  form.className = 'new-employee-form';
  form.append(...inputsElements, submitButton);

  return form;
}

function createNewRow(data, columns) {
  const row = document.createElement('tr');

  const tds = columns.map((column) => {
    const td = document.createElement('td');

    td.innerText = data[column];

    return td;
  });

  row.append(...tds);

  return row;
}

function createNotificationElement(title, description, type) {
  const notificationElement = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('ul');

  titleElement.className = 'title';
  titleElement.innerText = title;

  const messages = description.map((message) => {
    const li = document.createElement('li');

    li.innerText = message;

    return li;
  });

  descriptionElement.append(...messages);

  notificationElement.classList.add('notification', type);
  notificationElement.dataset.qa = 'notification';
  notificationElement.append(titleElement, descriptionElement);

  body.append(notificationElement);

  window.setTimeout(() => {
    notificationElement.remove();
  }, 3000);
}

function createCellInput(initialValue) {
  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';
  input.value = initialValue;

  return input;
}

function validateFormData(target, columns, offices) {
  const data = {};
  const validationErrors = [];

  columns.forEach((columnName) => {
    [...target.form].forEach((field) => {
      if (field.dataset.qa === columnName) {
        data[columnName] = field.value.trim();
      }
    });
  });

  if (!validate.extremumLength(data.name, 4)) {
    validationErrors.push('Too short name!');
  }

  if (!validate.extremumValue(+data.age, 18, 90)) {
    validationErrors.push('Age must be between 18 and 90!');
  }

  if (!validate.oneOfMany(data.office, offices)) {
    validationErrors.push('Enter office');
  }

  for (const [key, value] of Object.entries(data)) {
    if (!value || value.length === 0) {
      validationErrors.push(`Enter ${key}`);
    }
  }

  data.salary = '$' + Number(data.salary).toLocaleString('en-US');

  return {
    status: validationErrors.length === 0,
    data,
    validationErrors,
  };
}

function Validator() {
  this.extremumLength = function (value, min = 0, max = Infinity) {
    if (typeof value !== 'string') {
      return false;
    }

    if (value.length < min || value.length > max) {
      return false;
    }

    return true;
  };

  this.extremumValue = function (value, min = -Infinity, max = Infinity) {
    if (typeof value !== 'number') {
      return false;
    }

    if (value < min || value > max) {
      return false;
    }

    return true;
  };

  this.oneOfMany = function (value, ofValues) {
    if (!ofValues.some((office) => office === value)) {
      return false;
    }

    return true;
  };
}
