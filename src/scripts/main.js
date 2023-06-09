'use strict';

// write code here

const body = document.querySelector('tbody');
const table = document.querySelector('table');
const title = document.querySelector('thead');
const titleCells = title.querySelectorAll('th');

// #1

title.addEventListener('click', (e) => {
  const rows = body.querySelectorAll('tr');
  const index = e.target.cellIndex;
  const sortedColumn = [...rows].sort((rowA, rowB) => {
    const cellA = rowA.children[index].textContent.toUpperCase();
    const cellB = rowB.children[index].textContent.toUpperCase();

    if (index === titleCells.length - 1) {
      const numA = rowA.children[index].textContent.slice(1).replace(',', '');
      const numB = rowB.children[index].textContent.slice(1).replace(',', '');

      return numA - numB;
    } else {
      return cellA.localeCompare(cellB);
    }
  });

  if (titleCells[index].dataset.order === 'asc') {
    titleCells[index].dataset.order = 'desc';
    body.append(...sortedColumn.reverse());
  } else {
    titleCells[index].dataset.order = 'asc';
    body.append(...sortedColumn);
  }
});

// #2

body.addEventListener('click', (e) => {
  const rowIsAcrive = body.querySelector('.active');

  if (rowIsAcrive) {
    rowIsAcrive.classList.remove('active');
  }

  const elementSelected = e.target;

  elementSelected.parentElement.classList.toggle('active');
});

// #3
const form = document.createElement('form');
const button = document.createElement('button');
const label = document.createElement('label');

const qa = ['name', 'position', 'age', 'salary'];

form.className = 'new-employee-form';
form.action = '#';
form.method = 'GET';
button.textContent = `Save to table`;

form.innerHTML = `
  ${qa.map(text => `
    <label>${text[0].toLocaleUpperCase()
      + text.slice(1)}:<input name = ${text} data-qa = ${text}
      required></label>`).join(' ')
}`;

const options = [
  '',
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

label.innerHTML = `
Office:<select  name='office' required>
${options.map(text => `<option>${text}</option>`).join(' ')
}</select>`;

const inputs = form.querySelectorAll('input');

[...inputs].forEach(input => {
  if (input.name === 'age' || input.name === 'salary') {
    input.type = 'number';
  }
});

table.after(form);
form.children[1].after(label);
form.append(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const errorMessagesForm = [];

  [...inputs].forEach(input => {
    const messageForm = checkErrors(input.name, input.value);

    if (messageForm.length > 0) {
      errorMessagesForm.push(messageForm);
    }
  });

  if (errorMessagesForm.length === 0) {
    body.append(body.lastElementChild.cloneNode());

    for (let i = 0; i < titleCells.length; i++) {
      const cell = document.createElement('td');

      cell.textContent = e.target[i].value.trim();

      if (i === titleCells.length - 1) {
        convertNumberIntoSalary(e.target[i].value.trim(), cell);
      }

      body.lastElementChild.append(cell);
    }

    pushNotification('Success message',
      `${e.target[0].value} was added to the table`, 'success');
    e.currentTarget.reset();
  } else {
    pushNotification('Error message', errorMessagesForm[0], 'error');
  }
});

// #4

const pushNotification = (titleInfo, description, type) => {
  const block = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const message = document.createElement('p');
  const mainBody = document.querySelector('body');

  block.classList = `notification ${type}`;
  block.dataset.qa = `notification`;
  titleMessage.className = 'title';

  titleMessage.textContent = titleInfo;
  message.textContent = description;

  mainBody.append(block);
  block.append(titleMessage);
  block.append(message);

  block.style.top = `430px`;
  block.style.right = `5px`;

  setTimeout(() => {
    block.remove();
  }, 2000);
};

// #5
body.addEventListener('dblclick', (e) => {
  const currentCell = e.target.closest('td');

  const previousValue = currentCell.textContent;

  const changedCell = body.querySelector('input');

  if (changedCell) {
    changedCell.remove();
  }

  const cellInput = document.createElement('input');

  cellInput.classList = `cell-input`;

  cellInput.innerText = '';
  currentCell.textContent = cellInput.value;

  currentCell.append(cellInput);

  const changedRow = e.target.parentElement;

  const index = [...changedRow.children].indexOf(currentCell);
  const nameCell = titleCells[index].textContent.toLocaleLowerCase();

  if (nameCell === 'salary' || nameCell === 'age') {
    cellInput.type = 'number';
  }

  cellInput.focus();
  cellInput.style.maxWidth = '90px';

  cellInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      fillCell(cellInput, previousValue, currentCell, nameCell);

      const messageCell = checkErrors(nameCell, cellInput.value);

      if (messageCell.length !== 0) {
        pushNotification('Error message', messageCell, 'error');
        currentCell.textContent = previousValue;
      }
    }
  });

  cellInput.addEventListener('blur', (ev) => {
    fillCell(cellInput, previousValue, currentCell, nameCell);

    const messageCell = checkErrors(nameCell, cellInput.value);

    if (messageCell.length !== 0) {
      pushNotification('Error message', messageCell, 'error');
      currentCell.textContent = previousValue;
    }
  });
}, true);

function fillCell(cell, previous, current, nameColum) {
  if (cell.value.trim() !== '') {
    current.textContent = cell.value.trim();

    if (nameColum === 'salary') {
      current.textContent = convertNumberIntoSalary(cell.value.trim(), current);
    }
  } else {
    current.textContent = previous;
    pushNotification('Error message', 'Input is empty', 'error');
  }
};

function convertNumberIntoSalary(number, cellSalary) {
  let salary = number;
  const arrayThousands = [];

  while (salary > 0) {
    const thousands = salary % 1000;

    arrayThousands.unshift(thousands);

    salary = Math.floor(salary / 1000);
  }

  cellSalary.textContent = '$' + arrayThousands.join(',');

  return cellSalary.textContent;
}

function checkErrors(nameInput, valueInput) {
  let message = '';

  if (nameInput === 'age' && valueInput > 90) {
    message = 'Value must be less than or equal 90.';
  }

  if (nameInput === 'age' && valueInput < 18) {
    message = 'Value must be greater than or equal 18.';
  } ;

  if (nameInput === 'name' && valueInput.length < 4) {
    message = 'Please extend the name to 4 characters';
  }

  return message;
};
