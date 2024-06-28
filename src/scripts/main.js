'use strict';

const tHead = document.querySelector('thead');
const tHeadRow = tHead.querySelector('tr');
const tBody = document.querySelector('tbody');
const form = createForm();

document.body.append(form);

tHeadRow.addEventListener('click', sorting);

tBody.addEventListener('click', activateRow);
tBody.addEventListener('dblclick', handlerDblClick);

form.addEventListener('submit', handlerSubmit);

function handlerDblClick(e) {
  const targetCell = e.target.closest('td');

  if (!targetCell) {
    // eslint-disable-next-line
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

  if (value.length === 0) {
    return {
      type: 'warning',
      text: 'Cell can not be empty',
    };
  }

  if (currentIndex === 0 && value.length < 4) {
    return {
      type: 'warning',
      text: 'Name can not be less then 4 letters',
    };
  } else if (currentIndex === 3 && +value < 18) {
    return { type: 'warning', text: 'Age can not be less then 18' };
  } else if (currentIndex === 3 && +value > 90) {
    return { type: 'warning', text: 'Age can not be bigger then 90' };
  }

  return { type: 'success', text: 'User updated successfully' };
}

function handlerSubmit(e) {
  e.preventDefault();

  const row = document.createElement('tr');

  const message = validation(form);

  showMessage(message);

  if (message.type === 'error') {
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

    row.insertAdjacentElement('beforeend', cell);
  }

  tBody.insertAdjacentElement('beforeend', row);

  form.reset();
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

function activateRow(e) {
  const arrOfRows = [...tBody.querySelectorAll('tr')];

  arrOfRows.forEach((row) => {
    row.className = '';
  });

  e.target.closest('tr').className = 'active';
}

function sorting(e) {
  const arrOfTitleCells = [...tHeadRow.querySelectorAll('th')];

  const sortIndex = arrOfTitleCells.indexOf(e.target);

  if (sortIndex === -1) {
    // eslint-disable-next-line
    return;
  }

  const isDesc = e.target.dataset.isDesc === '';

  const arrOfRows = [...tBody.querySelectorAll('tr')];

  arrOfRows.sort((row1, row2) => {
    let cellValue1 = [...row1.querySelectorAll('td')][sortIndex].textContent;
    let cellValue2 = [...row2.querySelectorAll('td')][sortIndex].textContent;

    if (cellValue1.startsWith('$')) {
      cellValue1 = parseFloat(cellValue1.slice(1));
      cellValue2 = parseFloat(cellValue2.slice(1));
    }

    if (parseFloat(cellValue1)) {
      cellValue1 = parseFloat(cellValue1);
      cellValue2 = parseFloat(cellValue2);
    }

    switch (typeof cellValue1) {
      case 'string':
        if (isDesc) {
          return cellValue2.localeCompare(cellValue1);
        }

        return cellValue1.localeCompare(cellValue2);

      default:
        if (isDesc) {
          return cellValue2 - cellValue1;
        }

        return cellValue1 - cellValue2;
    }
  });

  arrOfRows.forEach((row) => {
    tBody.append(row);
  });

  e.target.toggleAttribute('data-is-desc');
}

function createForm() {
  const newForm = document.createElement('form');

  newForm.className = 'new-employee-form';

  const labelName = createInput('name');
  const labelPosition = createInput('position');
  const labelAge = createInput('age', 'number');
  const labelSalary = createInput('salary', 'number');
  const select = createSelect('office');
  const button = createButton();

  newForm.insertAdjacentElement('beforeend', labelName);
  newForm.insertAdjacentElement('beforeend', labelPosition);
  newForm.insertAdjacentElement('beforeend', select);
  newForm.insertAdjacentElement('beforeend', labelAge);
  newForm.insertAdjacentElement('beforeend', labelSalary);
  newForm.insertAdjacentElement('beforeend', button);

  return newForm;
}

function createInput(nameInput, type = 'test') {
  const label = document.createElement('label');
  const input = document.createElement('input');

  const nameLabel = capitalizeFirstLetter(nameInput);

  input.name = nameInput;
  input.type = type;
  input.dataset.qa = nameInput;
  input.required = false;

  label.insertAdjacentText('afterbegin', `${nameLabel}`);
  label.insertAdjacentElement('beforeend', input);

  return label;
}

function createSelect(nameSelect) {
  const labelSelect = document.createElement('label');
  const select = document.createElement('select');

  select.name = nameSelect;
  select.dataset.qa = 'office';

  const labelText = capitalizeFirstLetter(nameSelect);

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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function createButton() {
  const button = document.createElement('button');

  button.type = 'submit';

  button.insertAdjacentText('beforeend', 'Save to table');

  return button;
}

function validation(formForValid) {
  const nameValue = formForValid['name'].value;
  const age = +formForValid['age'].value;
  const position = formForValid['position'].value;
  const office = formForValid['office'].value;
  const salary = formForValid['salary'].value;

  if (position === '' || office === '' || salary === '') {
    return { type: 'error', text: 'All fields must be filled in' };
  }

  if (nameValue.length < 4) {
    return { type: 'error', text: 'Name can not be less then 4 letters' };
  }

  if (age < 18) {
    return { type: 'error', text: 'Age can not be less then 18' };
  }

  if (age > 90) {
    return { type: 'error', text: 'Age can not be bigger then 90' };
  }

  return { type: 'success', text: 'User added successfully' };
}
