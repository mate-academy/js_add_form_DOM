'use strict';

const table = document.querySelector('table');

let sortedRows = [];

const cities = [...table.tBodies[0].children]
  .map((row) => row.children[2].textContent)
  .filter((city, i, arr) => {
    return arr.indexOf(city) === i;
  });

table.tHead.addEventListener('click', (e) => {
  sortEmployees(e.target.textContent, e.target);
});

selectRow();

createMsgBlock();

function getIdx(title) {
  const idx = 0;

  switch (title) {
    case 'Position':
      return 1;
    case 'Office':
      return 2;
    case 'Age':
      return 3;
    case 'Salary':
      return 4;
    default:
      return idx;
  }
}

function normalizeSortByNum(arr, i, attr) {
  return arr.sort((rowA, rowB) => {
    if (attr === 'asc') {
      return (
        +[...rowA.children][i].textContent.replace(/[^0-9.]/g, '') -
        +[...rowB.children][i].textContent.replace(/[^0-9.]/g, '')
      );
    } else {
      return (
        +[...rowB.children][i].textContent.replace(/[^0-9.]/g, '') -
        +[...rowA.children][i].textContent.replace(/[^0-9.]/g, '')
      );
    }
  });
}

function normalizeSortByStr(arr, i, attr) {
  return arr.sort((rowA, rowB) => {
    if (attr === 'asc') {
      return [...rowA.children][i].textContent.localeCompare(
        [...rowB.children][i].textContent,
      );
    } else {
      return [...rowB.children][i].textContent.localeCompare(
        [...rowA.children][i].textContent,
      );
    }
  });
}

function sortEmployees(title, elem) {
  const idx = getIdx(title);

  switch (title) {
    case 'Age':
    case 'Salary':
      if (!elem.dataset.order || elem.dataset.order === 'desc') {
        sortedRows = normalizeSortByNum(
          [...table.tBodies[0].children],
          idx,
          'asc',
        );

        elem.removeAttribute('desc');
        elem.setAttribute('data-order', 'asc');
      } else {
        sortedRows = normalizeSortByNum(
          [...table.tBodies[0].children],
          idx,
          'desc',
        );
        elem.removeAttribute('asc');
        elem.setAttribute('data-order', 'desc');
      }

      break;

    default:
      if (!elem.dataset.order || elem.dataset.order === 'desc') {
        sortedRows = normalizeSortByStr(
          [...table.tBodies[0].children],
          idx,
          'asc',
        );

        elem.removeAttribute('desc');
        elem.setAttribute('data-order', 'asc');
      } else {
        sortedRows = normalizeSortByStr(
          [...table.tBodies[0].children],
          idx,
          'desc',
        );

        elem.removeAttribute('asc');
        elem.setAttribute('data-order', 'desc');
      }

      break;
  }

  table.tBodies[0].remove();
  insertRows(sortedRows);
  removeCellText();
}

function insertRows(rows) {
  const tBody = document.createElement('tbody');

  rows.map((row) => {
    tBody.append(row);
  });

  table.append(tBody);
  selectRow();
}

function selectRow() {
  table.tBodies[0].addEventListener('click', (e) => {
    e.target.parentNode.classList.toggle('active');

    [...document.querySelector('tbody').children].map((row) => {
      if (row !== e.target.parentNode) {
        row.classList.remove('active');
      }
    });
  });
}

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const headlines = [...table.tHead.firstElementChild.children].map(
    (th) => th.textContent,
  );

  headlines.forEach((headline) => {
    const label = document.createElement('label');

    label.textContent = `${headline}:`;

    form.append(label);
  });

  form.append(createButton());

  document.body.appendChild(form);

  addInputs();
}

createForm();

function createButton() {
  const button = document.createElement('button');

  button.setAttribute('type', 'submit');
  button.textContent = 'Save to table';

  return button;
}

function createSelect() {
  const select = document.createElement('select');

  cities.map((city) => {
    const option = document.createElement('option');

    option.setAttribute('value', city);
    option.textContent = city;
    select.append(option);
  });

  return select;
}

function addInputs() {
  [...document.querySelectorAll('.new-employee-form label')].map((label) => {
    const input = document.createElement('input');
    const value =
      label.textContent[0].toLowerCase() + label.textContent.slice(1, -1);

    switch (label.textContent.slice(0, -1)) {
      case 'Name':
      case 'Position':
        input.setAttribute('name', value);
        input.setAttribute('type', 'text');
        input.setAttribute('data-qa', value);
        input.required = true;
        label.append(input);
        break;

      case 'Age':
      case 'Salary':
        input.setAttribute('name', value);
        input.setAttribute('type', 'number');
        input.setAttribute('data-qa', value);
        input.required = true;
        label.append(input);
        break;

      default:
        const select = createSelect();

        select.setAttribute('name', value);
        select.setAttribute('data-qa', value);
        select.required = true;
        label.append(select);
        break;
    }
  });
}

const formField = document.querySelector('.new-employee-form');
const userName = formField.querySelector('[data-qa="name"]');
const userPosition = formField.querySelector('[data-qa="position"]');
const userOffice = formField.querySelector('select');
const userAge = formField.querySelector('[data-qa="age"]');
const userSalary = formField.querySelector('[data-qa="salary"]');

formField.addEventListener('submit', (e) => {
  e.preventDefault();
  makeValidation();
});

function makeValidation() {
  const userNameValue = userName.value.trim();
  const userAgeValue = userAge.value.trim();
  const userPositionValue = userPosition.value.trim();
  const userSalaryValue = userSalary.value.trim();
  const userOfficeValue = userOffice.value;
  const arrOfValues = [];

  if (userNameValue.length < 4) {
    showNotification('error', 'Name must be at least 4 characters!');

    return;
  }

  if (userNameValue.split(' ').length !== 2) {
    showNotification('error', 'Name should contain name and surname!');

    return;
  }

  if (userAgeValue < 18 || userAgeValue >= 90) {
    showNotification('error', 'Age must be more than 18 and less than 90!');

    return;
  }

  showNotification('success', 'New employee added to the table!');

  arrOfValues.push(
    editStr(userNameValue),
    editStr(userPositionValue),
    userOfficeValue,
    userAgeValue,
    userSalaryValue,
  );
  addRow(arrOfValues);
  formField.reset();
}

function editStr(val) {
  const str = val
    .split(' ')
    .map((item) => item[0].toUpperCase() + item.slice(1));

  return str.join(' ');
}

function showNotification(calssValue, str) {
  const title = calssValue[0].toUpperCase() + calssValue.slice(1);
  const msg = document.querySelector('.notification');

  msg.children[0].textContent = title;
  msg.children[1].textContent = str;

  if (!msg.className.split(' ')[1]) {
    msg.className += ` ${calssValue}`;
  } else {
    const arrOfClasses = msg.className.split(' ');

    arrOfClasses[1] = calssValue;

    msg.className = arrOfClasses.join(' ');
  }

  msg.style.visibility = 'visible';
  setTimeout(timerNotification, 2000);
}

function timerNotification() {
  const msg = document.querySelector('.notification');

  msg.style.visibility = 'hidden';
}

function createMsgBlock() {
  const msgBlock = document.createElement('div');
  const titleMsg = document.createElement('h2');
  const desc = document.createElement('p');

  titleMsg.classList.add('title');
  titleMsg.style.textAlign = 'center';
  desc.style.bold = '600';

  msgBlock.setAttribute('data-qa', 'notification');
  msgBlock.classList.add('notification');
  msgBlock.style.zIndex = '1';
  msgBlock.style.visibility = 'hidden';

  msgBlock.append(titleMsg, desc);
  document.body.append(msgBlock);

  return msgBlock;
}

function editSalaryValue(val) {
  const salary = '$';
  const number = Number(val).toLocaleString().replace(/\s/g, ',');

  return salary + number;
}

function addRow(arr) {
  const row = table.tBodies[0].insertRow(-1);

  for (let i = 0; i < arr.length; i++) {
    const cell = row.insertCell(i);

    if (i === arr.length - 1) {
      cell.innerHTML = editSalaryValue(arr[i]);
    } else {
      cell.innerHTML = `${arr[i]}`;
    }
  }
}

let previousValue;

function removeCellText() {
  table.tBodies[0].addEventListener('dblclick', (e) => {
    const currentCell = e.target;
    const cellValue = currentCell.textContent;
    const input = document.createElement('input');

    input.classList.add('cell-input');
    e.target.textContent = '';
    e.target.appendChild(input);

    table.tBodies[0].querySelectorAll('td').forEach((td) => {
      if (td !== currentCell && td.firstChild.className === 'cell-input') {
        td.firstChild.remove();
        td.textContent = previousValue;
      }
    });

    previousValue = cellValue;
    inputBlur(input, cellValue);
  });
}

removeCellText();

function inputBlur(element, value) {
  element.focus();

  element.addEventListener('blur', (e) => {
    table.tBodies[0].querySelectorAll('td').forEach((td) => {
      if (td.firstChild.className === 'cell-input') {
        td.firstChild.remove();

        td.textContent = element.value
          ? /\d/.test(element.value)
            ? editSalaryValue(element.value)
            : editStr(element.value)
          : value;
      }
    });
  });

  keypressEvent(element, value);
}

function keypressEvent(input, value) {
  input.addEventListener('keypress', (e) => {
    if (e.keyCode === 13 && input.value) {
      table.tBodies[0].querySelectorAll('td').forEach((td) => {
        if (td.firstChild.className === 'cell-input') {
          td.firstChild.remove();

          if (value.startsWith('$')) {
            td.textContent = editSalaryValue(input.value);
          } else {
            td.textContent = editStr(input.value);
          }
        }
      });
    }

    if (e.keyCode === 13 && !input.value) {
      table.tBodies[0].querySelectorAll('td').forEach((td) => {
        if (td.firstChild.className === 'cell-input') {
          td.firstChild.remove();
          td.textContent = value;
        }
      });
    }
  });
}
