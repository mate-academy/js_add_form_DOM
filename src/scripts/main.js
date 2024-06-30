'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

// #region sorting

const headings = document.querySelectorAll('th');
const footerHeadings = document.querySelectorAll('tfoot th');
const rows = [...tbody.querySelectorAll('tr')];

const sortDirections = Array.from({ length: headings.length }, () => -1);

headings.forEach((heading, index) => {
  heading.addEventListener('click', () => {
    sortColumn(index);
  });
});

footerHeadings.forEach((footerHeading, index) => {
  footerHeading.addEventListener('click', () => {
    sortColumn(index);
  });
});

function sortColumn(index) {
  sortDirections[index] *= -1;

  rows.sort((a, b) => {
    const aParams = a.cells[index].textContent;
    const bParams = b.cells[index].textContent;

    return (
      sortDirections[index] *
      aParams.localeCompare(bParams, undefined, { numeric: true })
    );
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.append(row));
}

// #endregion

// #region active row
tbody.addEventListener('click', activateRow);

function activateRow(e) {
  const arrOfRows = [...tbody.querySelectorAll('tr')];

  arrOfRows.forEach((row) => {
    row.className = '';
  });

  e.target.closest('tr').className = 'active';
}

// #endregion

// #region create form

const newCustomerForm = createForm();

document.body.appendChild(newCustomerForm);

function createForm() {
  const form = document.createElement('form');

  form.setAttribute('class', 'new-employee-form');

  const labelName = createInput('name');
  const labelPosition = createInput('position');
  const labelAge = createInput('age', 'number');
  const labelSalary = createInput('salary', 'number');
  const select = createSelect('office');
  const button = createButton();

  form.insertAdjacentElement('beforeend', labelName);
  form.insertAdjacentElement('beforeend', labelPosition);
  form.insertAdjacentElement('beforeend', select);
  form.insertAdjacentElement('beforeend', labelAge);
  form.insertAdjacentElement('beforeend', labelSalary);
  form.insertAdjacentElement('beforeend', button);

  return form;
}

function createInput(inputName, type = 'text') {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const labelName = inputName[0].toUpperCase() + inputName.slice(1);

  input.name = inputName;
  input.type = type;
  input.dataset.qa = inputName;

  label.insertAdjacentText('afterbegin', `${labelName}`);
  label.insertAdjacentElement('beforeend', input);

  return label;
}

function createSelect(nameSelect) {
  const labelSelect = document.createElement('label');
  const select = document.createElement('select');

  select.name = nameSelect;
  select.dataset.qa = 'office';

  const labelText = nameSelect[0].toUpperCase() + nameSelect.slice(1);

  labelSelect.insertAdjacentText('afterbegin', labelText);

  const options = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ].map((city) => {
    const option = document.createElement('option');

    option.value = city;
    option.insertAdjacentText('beforeend', city);

    return option;
  });

  options.forEach((option) => {
    select.insertAdjacentElement('beforeend', option);
  });

  labelSelect.insertAdjacentElement('beforeend', select);

  return labelSelect;
}

function createButton() {
  const button = document.createElement('button');

  button.setAttribute('id', 'button');
  button.type = 'submit';

  button.insertAdjacentText('beforeend', 'Save to table');

  return button;
}

// #endregion

// #region submit functionality

newCustomerForm.addEventListener('submit', createNewEmploee);

function createNewEmploee(e) {
  e.preventDefault();

  const newRow = document.createElement('tr');

  const chekoutText = valuesValidation(newCustomerForm);

  showMessage(chekoutText);

  if (chekoutText.type === 'error') {
    return;
  }

  const salary = +e.target['salary'].value;

  const values = [
    e.target['name'].value,
    e.target['position'].value,
    e.target['office'].value,
    e.target['age'].value,
    `$${salary.toLocaleString('en-EN')}`,
  ];

  for (const value of values) {
    const cell = document.createElement('td');

    cell.insertAdjacentText('beforeend', value);

    newRow.insertAdjacentElement('beforeend', cell);
  }

  tbody.insertAdjacentElement('beforeend', newRow);

  rows.push(newRow);

  newCustomerForm.reset();
}

function showMessage(message) {
  const newNotificationBlock = document.createElement('div');
  const oldNotificationBlock = document.querySelector('.notification');

  if (oldNotificationBlock) {
    oldNotificationBlock.remove();
  }

  const title = document.createElement('h1');
  const text = document.createElement('p');

  if (!newNotificationBlock.className) {
    newNotificationBlock.className = 'notification';
    newNotificationBlock.dataset.qa = 'notification';
  }

  switch (message.type) {
    case 'error':
      title.innerText = 'ERROR';
      newNotificationBlock.classList.add('error');
      break;

    case 'warning':
      title.innerText = 'ERROR';
      newNotificationBlock.classList.add('error');
      break;

    default:
      title.innerText = 'SUCCESS';
      newNotificationBlock.classList.add('success');
      break;
  }

  text.innerText = message.text;

  newNotificationBlock.insertAdjacentElement('afterbegin', title);
  newNotificationBlock.insertAdjacentElement('beforeend', text);

  document.body.append(newNotificationBlock);

  window.setTimeout(() => {
    newNotificationBlock.remove();
  }, 5000);
}

function valuesValidation(inputToCheck) {
  const nameValue = inputToCheck['name'].value;
  const age = +inputToCheck['age'].value;
  const position = inputToCheck['position'].value;
  const office = inputToCheck['office'].value;
  const salary = inputToCheck['salary'].value;

  const ERROR_EMPTY_FIELDS = 'All fields must be filled in';
  const ERROR_TO_SHORT_NAME = 'Name can not be less then 4 letters';
  const ERROR_TO_SMALL_AGE = 'Age can not be less then 18';
  const ERROR_TO_BIG_AGE = 'Age can not be bigger then 90';
  const SUCCESSFUL_INPUT = 'User added successfully';

  if (position === '' || office === '' || salary === '') {
    return { type: 'error', text: ERROR_EMPTY_FIELDS };
  }

  if (nameValue.length < 4) {
    return { type: 'error', text: ERROR_TO_SHORT_NAME };
  }

  if (age < 18) {
    return { type: 'error', text: ERROR_TO_SMALL_AGE };
  }

  if (age > 90) {
    return { type: 'error', text: ERROR_TO_BIG_AGE };
  }

  return { type: 'success', text: SUCCESSFUL_INPUT };
}

// #endregion

// #region editing table

tbody.addEventListener('dblclick', editCell);

function editCell(e) {
  const targetCell = e.target.closest('td');

  if (!targetCell) {
    return;
  }

  const value = targetCell.innerText;

  const cellInput = document.createElement('input');

  cellInput.className = 'cell-input';
  cellInput.autofocus = true;
  cellInput.dataset.oldValue = value;
  cellInput.value = value;

  if (!targetCell.nextElementSibling) {
    cellInput.type = 'number';
    cellInput.value = parseFloat(value.slice(1).replace(/,/g, ''));
  }

  targetCell.innerText = '';
  targetCell.insertAdjacentElement('beforeend', cellInput);

  cellInput.addEventListener('blur', handlerBlur);
  cellInput.addEventListener('keypress', handlerKeypress);
}

function handlerBlur(e) {
  const input = e.target;

  const message = cellValid(input);

  showMessage(message);

  if (message.type === 'error' || message.type === 'warning') {
    input.focus();

    return;
  }

  saveCellValue(input);
}

function handlerKeypress(e) {
  const key = e.key;

  if (key !== 'Enter') {
    return;
  }

  const input = e.target;

  const message = cellValid(input);

  showMessage(message);

  if (message.type === 'error' || message.type === 'warning') {
    return;
  }

  saveCellValue(input);
}

function saveCellValue(input) {
  let newValue = input.value;
  const targetCell = input.closest('td');

  if (!targetCell.nextElementSibling) {
    newValue = `$${parseFloat(newValue).toLocaleString('en-EN')}`;
  }

  targetCell.innerText = newValue;
  input.remove();
}

function cellValid(input) {
  const row = input.closest('tr');
  const arrOfCell = [...row.querySelectorAll('td')];
  const currentIndex = arrOfCell.findIndex((cell) => {
    return cell.firstChild === input;
  });

  const value = input.value;

  const WARNING_EMPTY_CELL = 'Cell can not be empty';
  const WARNING_SHORT_NAME = 'Name can not be less then 4 letters';
  const WARNING_SMALL_AGE = 'Age can not be less then 18';
  const WARNING_BIG_AGE = 'Age can not be bigger then 90';
  const SUCCESS_VALIDATION = 'User updated successfully';

  if (value.length === 0 || value.trim() === '') {
    return {
      type: 'warning',
      text: WARNING_EMPTY_CELL,
    };
  }

  if ((currentIndex === 0 && value.length < 4) || value.trim() === '') {
    return {
      type: 'warning',
      text: WARNING_SHORT_NAME,
    };
  } else if ((currentIndex === 3 && +value < 18) || value.trim() === '') {
    return { type: 'warning', text: WARNING_SMALL_AGE };
  } else if ((currentIndex === 3 && +value > 90) || value.trim() === '') {
    return { type: 'warning', text: WARNING_BIG_AGE };
  }

  return { type: 'success', text: SUCCESS_VALIDATION };
}

// #endregion
