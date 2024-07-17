'use strict';

const tHead = document.querySelector('thead').firstElementChild;

let selectedColumn = null;

let count = 1;

const sortColumns = (e) => {
  const column = [...tHead.children].indexOf(e.target);

  if (selectedColumn === column) {
    count++;
  }

  const tbody = document.querySelector('tbody');
  const rows = [...tbody.children];

  rows.sort((row1, row2) => {
    let sortCell1 = row1.children[column].innerText;
    let sortCell2 = row2.children[column].innerText;

    if (column === 3) {
      sortCell1 = +sortCell1;
      sortCell2 = +sortCell2;

      return sortCell1 - sortCell2;
    }

    if (column === 4) {
      sortCell1 = +sortCell1.slice(1).replace(',', '');
      sortCell2 = +sortCell2.slice(1).replace(',', '');

      return sortCell1 - sortCell2;
    }

    return sortCell1.localeCompare(sortCell2);
  });

  if (count % 2 === 0 && count !== 0) {
    rows.reverse();
  }
  selectedColumn = column;

  tbody.replaceChildren(...rows);
};

const focusOnRow = (e) => {
  document.querySelectorAll('.active').forEach((el) => {
    el.classList.remove('active');
  });

  e.target.parentElement.classList.add('active');
};

tHead.addEventListener('click', sortColumns);

document.querySelector('tbody').addEventListener('click', focusOnRow);

// #region form

const createLabel = (inputName) => {
  const newElement = document.createElement('label');

  newElement.innerText = inputName[0].toUpperCase() + inputName.slice(1) + ': ';

  return newElement;
};

const createInput = (inputName, type) => {
  const newElement = createLabel(inputName);
  const newInput = document.createElement('input');

  newInput.setAttribute('name', inputName.toLowerCase());
  newInput.setAttribute('type', type);
  newInput.setAttribute('data-qa', inputName.toLowerCase());
  newElement.append(newInput);

  return newElement;
};

const createSelect = () => {
  const selectOptions = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ];

  const selectItem = createLabel('Office');
  const select = document.createElement('select');

  select.setAttribute('name', 'office');
  select.setAttribute('data-qa', 'office');

  selectOptions.forEach((item) => {
    const option = document.createElement('option');

    option.innerText = item;
    option.setAttribute('name', item);
    select.append(option);
  });

  selectItem.append(select);

  return selectItem;
};

const createButton = () => {
  const button = document.createElement('button');

  button.classList.add('button');
  button.innerText = 'Save to table';
  button.setAttribute('formnovalidate', 'true');

  return button;
};

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.append(createInput('name', 'text'));
form.append(createInput('position', 'text'));
form.append(createSelect());
form.append(createInput('age', 'number'));
form.append(createInput('salary', 'number'));
form.append(createButton());
form.setAttribute('autocomplete', 'off');

const getNormalizedSalary = (n) => '$' + n.toLocaleString('en-US');

const clearForm = () => {
  const formElements = ['name', 'position', 'office', 'age', 'salary'];

  formElements.forEach((el) => {
    form.elements[el].value = '';

    if (el === 'office') {
      form.elements[el].value = 'Tokyo';
    }
  });
};

let notificationBottom = 10;

const createNotification = (type, innerText, innerTitle) => {
  const notification = document.createElement('div');
  const text = document.createElement('p');
  const title = document.createElement('h2');

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');
  title.classList.add('title');

  text.innerText = innerText;
  title.innerText = innerTitle;
  notification.append(text);
  notification.append(title);

  notification.style.bottom = notificationBottom + 'px';

  document.body.append(notification);
  notificationBottom += 110;

  setTimeout(() => {
    notification.style.animation = 'slide-out 1s';
  }, 4000);

  setTimeout(() => {
    notification.remove();
    notificationBottom = 10;
  }, 4700);
};

const checkName = (fullName) => {
  const letters = fullName
    .split('')
    .map((letter) => letter.toUpperCase() !== letter.toLowerCase());

  if (letters.length < 4 || fullName.length < 4) {
    createNotification(
      'error',
      'Name has less than 4 letters!',
      'Invalid name!',
    );
  }
};

const checkAge = (age) => {
  if (age < 18 || age > 90) {
    createNotification('error', 'Please provide valid age!', 'Invalid age!');
  }
};

const validateForm = (dataFromForm) => {
  const fullName = dataFromForm[0];
  const age = dataFromForm[3];
  const hasEmptyField = dataFromForm.some((el) => el.trim().length === 0);

  if (hasEmptyField) {
    createNotification(
      'error',
      'No empty fields are allowed',
      'Please fill in the form!',
    );
  }

  checkName(fullName);
  checkAge(age);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const fullName = data.get('name').trim();
  const position = data.get('position').trim();
  const office = data.get('office');
  const age = data.get('age').trim();
  const salary = data.get('salary').trim();
  const dataFromForm = [fullName, position, office, age, salary];

  validateForm(dataFromForm);

  const notifications = document.querySelectorAll('.notification');

  if (notifications.length === 0) {
    const newRow = document.createElement('tr');

    dataFromForm.forEach((el, index) => {
      const cell = document.createElement('td');

      cell.innerText = index === 4 ? getNormalizedSalary(+el) : el;
      newRow.append(cell);
    });
    document.querySelector('tbody').prepend(newRow);
    clearForm();

    createNotification(
      'success',
      'You successfully saved new employee to the table',
      'Saved to the table',
    );
  }
});

document.body.append(form);

// #endregion

const createCellInput = (startText) => {
  const input = document.createElement('input');

  input.value = startText;
  input.setAttribute('autofocus', 'true');
  input.setAttribute('type', 'text');
  input.classList.add('cellInput');

  input.addEventListener('blur', (e) => {
    input.replaceWith(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.replaceWith(startText);
    }
  });

  return input;
};

const editCellInput = (e) => {
  const currentEl = e.target;
  const input = createCellInput(currentEl.innerText);

  currentEl.replaceChildren(input);
};

document.querySelector('tbody').addEventListener('dblclick', editCellInput);
