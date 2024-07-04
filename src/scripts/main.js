'use strict';

const table = document.querySelector('table');
const tBody = table.tBodies[0];
const tHead = table.tHead;
const tHeadCells = tHead.rows[0].cells;

table.insertAdjacentHTML(
  'afterend',
  `<form class="new-employee-form">
    <label>Name: <input id="name" name="name" type="text" data-qa="name"></label>
    <label>Position: <input id="position" name="position" type="text" data-qa="position"></label>
    <label>Office: <select id="office" name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select></label>
    <label>Age: <input id="age" name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input id="salary" name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  </form>`,
);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEmployee = document.getElementById('name').value.trim();

  if (validation(nameEmployee, 'name')) {
    return;
  }

  const positionEmployee = document.getElementById('position').value.trim();

  if (validation(positionEmployee, 'position')) {
    return;
  }

  const offiseEmployee = document.getElementById('office').value;
  const ageEmployee = document.getElementById('age').value;

  if (validation(ageEmployee, 'age')) {
    return;
  }

  const salaryEmployee = document.getElementById('salary').value;
  const convertSalaryEmployee = convertToUSD(salaryEmployee);

  tBody.insertAdjacentHTML(
    'beforeend',
    `<tr>
      <td>${nameEmployee}</td>
      <td>${positionEmployee}</td>
      <td>${offiseEmployee}</td>
      <td>${ageEmployee}</td>
      <td>${convertSalaryEmployee}</td>
    </tr>`,
  );

  pushNotification(
    10,
    10,
    'Success',
    'Success add.\n ' + 'New employee added succesfuly.',
    'success',
  );

  form.reset();
});

const clicksCounter = [0, 0, 0, 0, 0];

for (let i = 0; i < tHeadCells.length; i++) {
  tHeadCells[i].addEventListener('click', function () {
    const tableBody = document.querySelector('table').tBodies[0];
    const tableRows = [...tableBody.rows];

    tableRows.sort((a, b) => {
      const cellA = a.cells[i].innerText.toLowerCase();
      const cellB = b.cells[i].innerText.toUpperCase();

      if (clicksCounter[i] % 2 === 0) {
        return sortTable(cellA, cellB);
      } else {
        return sortTable(cellB, cellA);
      }
    });

    clicksCounter[i] = clicksCounter[i] + 1;

    tableRows.forEach((row) => {
      tableBody.append(row);
    });
  });
}

let currentActiveTr;

tBody.addEventListener('click', (e) => {
  const newTr = e.target.closest('tr');

  newTr.classList.add('active');

  if (currentActiveTr !== newTr) {
    if (currentActiveTr) {
      currentActiveTr.classList.remove('active');
    }
    currentActiveTr = newTr;
  }
});

tBody.addEventListener('dblclick', (e) => {
  const changeCells = e.target;
  const changeCellIndex = changeCells.cellIndex;
  const contentCell = changeCells.textContent;

  changeCells.textContent = '';

  switch (changeCellIndex) {
    case 0:
      changeCells.insertAdjacentHTML(
        'beforeend',
        `<input class="cell-input" id="changeCell" name="name" type="text">`,
      );
      break;

    case 1:
      changeCells.insertAdjacentHTML(
        'beforeend',
        `<input class="cell-input" id="changeCell" name="position" type="text">`,
      );
      break;

    case 2:
      changeCells.insertAdjacentHTML(
        'beforeend',
        `<select class="cell-input" id="changeCell" name="office">
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>`,
      );
      break;

    case 3:
      changeCells.insertAdjacentHTML(
        'beforeend',
        `<input class="cell-input" id="changeCell" name="age" type="number">`,
      );
      break;

    case 4:
      changeCells.insertAdjacentHTML(
        'beforeend',
        `<input class="cell-input" id="changeCell" name="salary" type="number">`,
      );
      break;
  }

  const inputText = document.getElementById('changeCell');

  inputText.focus();

  inputText.addEventListener('blur', changedCells);

  inputText.addEventListener('keydown', (evt) => {
    if (evt.code === 'Enter') {
      changedCells();
    }
  });

  function changedCells() {
    const inputTextValue = inputText.value.trim();

    if (
      inputTextValue.length > 0 &&
      !validateCahgeCell(inputTextValue, changeCellIndex)
    ) {
      if (changeCellIndex === 4) {
        changeCells.textContent = convertToUSD(inputTextValue);
      } else {
        changeCells.textContent = inputTextValue;
      }
    } else {
      changeCells.textContent = contentCell;
    }

    inputText.remove();
  }
});

function pushNotification(posTop, posRight, title, description, type) {
  const nottification = document.createElement('div');

  document.querySelector('body').append(nottification);

  nottification.classList.add('notification');
  nottification.classList.add(type);
  nottification.setAttribute('data-qa', 'notification');
  nottification.style.top = `${posTop}px`;
  nottification.style.right = `${posRight}px`;

  nottification.insertAdjacentHTML(
    'beforeend',
    `
    <h2 class="title">${title}</h2>
    <p>${description}</p>`,
  );

  setTimeout(() => {
    nottification.remove();
  }, 2000);
}

function sortTable(cellA, cellB) {
  return cellA.localeCompare(cellB, undefined, { numeric: true });
}

function validation(text, type) {
  switch (type) {
    case 'name':
      if (text.length < 4) {
        pushNotification(
          10,
          10,
          'Error',
          'Name wrong.\n ' + 'Length of name should have length more than 4.',
          'error',
        );

        return true;
      }
      break;

    case 'age':
      if (text < 18 || text > 90) {
        pushNotification(
          10,
          10,
          'Error',
          'Age wrong.\n ' + 'Age have to be more than 18 and less than 90.',
          'error',
        );

        return true;
      }
      break;

    case 'position':
      if (!text) {
        pushNotification(
          10,
          10,
          'Error',
          'Position wrong.\n ' + 'Position have to be entered.',
          'error',
        );

        return true;
      }
      break;

    default:
      return false;
  }
}

function validateCahgeCell(text, index) {
  switch (index) {
    case 0:
      return validation(text, 'name');

    case 1:
      return validation(text, 'position');

    case 3:
      return validation(text, 'age');

    default:
      return false;
  }
}

function convertToUSD(elem) {
  return Number(elem).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
}
