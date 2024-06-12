'use strict';

const root = document.querySelector('body');
const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

let asc = true;
let checkColumn;

function ascSort(rowCollection, targetIndex, type) {
  asc = true;

  return Array.from(rowCollection).sort((a, b) => {
    const cellA = normalize(type, a.cells[targetIndex].innerText);
    const cellB = normalize(type, b.cells[targetIndex].innerText);

    return isNaN(cellA)
      ? cellA.localeCompare(cellB)
      : cellA - cellB;
  });
}

function descSort(rowCollection, targetIndex, type) {
  asc = false;

  return Array.from(rowCollection).sort((a, b) => {
    const cellA = normalize(type, a.cells[targetIndex].innerText);
    const cellB = normalize(type, b.cells[targetIndex].innerText);

    return isNaN(cellA)
      ? cellB.localeCompare(cellA)
      : cellB - cellA;
  });
}

function normalize(type, value) {
  if (type !== 'Salary' && type !== 'salary') {
    return value;
  }

  return isNaN(parseInt(value))
    ? parseInt(value.replace(/[$,]/g, ''))
    : '$' + Number(value).toLocaleString('en-US');
}

function appendElement(table, el) {
  table.append(el);
}

// Sort table
tHead.addEventListener('click', (evt) => {
  const title = evt.target;
  const idx = title.cellIndex;
  const type = title.innerText;

  if (checkColumn === idx && asc) {
    return descSort(tBody.rows, idx, type).forEach(rowEl => {
      appendElement(tBody, rowEl);
    });
  }

  return ascSort(tBody.rows, idx, type).forEach(rowEl => {
    appendElement(tBody, rowEl);
    checkColumn = idx;
  });
});

// Add class active to rows
tBody.addEventListener('click', (evt) => {
  const targetEl = evt.target;

  Array.from(tBody.rows).forEach(row => row.classList.contains('active')
    ? row.classList.remove('active')
    : targetEl.parentNode.classList.add('active'));
});

// Add Form on page
const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('method', 'get');

form.insertAdjacentHTML('afterbegin', `
    <label for="name">
      Name:
      <input
        id="name"
        type="text"
        name="name"
        data-qa="name"
      >
    </label>

    <label for="position">
      Position:
      <input
        id="position"
        name="position"
        type="text"
        data-qa="position"
      >
    </label>

    <label for="office">
      Office:
      <select
        id="office"
        name="office"
        data-qa="office"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label for="age">
      Age:
      <input
        id="age"
        type="number"
        name="age"
        data-qa="age"
      >
    </label>

    <label for="salary">
      Salary:
      <input
        id="salary"
        type="number"
        name="salary"
        data-qa="salary"
      >
    </label>

    <button id="submit" type="submit">Save to table</button>
`);
root.append(form);

// Add data from form in table
function valitadeInput(input) {
  if (input.name === 'name' && input.value.length < 4) {
    throw new Error('Name can not be less than 4 letters');
  }

  if (input.name === 'position' && input.value.length <= 0) {
    throw new Error('Please enter position name.');
  }

  if (input.name === 'age' && (input.value < 18 || input.value > 90)) {
    throw new Error('Please, enter a valid age.');
  }
}

function onAddRow(e) {
  e.preventDefault();

  const data = new FormData(form);
  const nameInput = data.get('name');
  const positionInput = data.get('position');
  const officeInput = data.get('office');
  const ageInput = data.get('age');
  const salaryInput = data.get('salary');
  const newSalary = '$' + Number(salaryInput).toLocaleString('en-US');

  inputs.forEach(input => valitadeInput(input));

  const row = document.createElement('tr');

  row.insertAdjacentHTML('afterbegin', `
      <td>${nameInput}</td>
      <td>${positionInput}</td>
      <td>${officeInput}</td>
      <td>${ageInput}</td>
      <td>${newSalary}</td>
  `);

  tBody.append(row);

  pushNotification('Success',
    'Employee was added to the table', 'success');

  form.reset();
}

form.addEventListener('submit', (evt) => {
  try {
    onAddRow(evt);
  } catch (error) {
    pushNotification('Error', error.message, 'error');
  }
});

// Notification
const { bottom, right, width } = form.getBoundingClientRect();

const container = document.createElement('div');

container.style.cssText = `
  position: absolute;
  top: ${bottom + 24}px;
  left: ${right - width}px;
  display: grid;
  gap: 24px;
`;
root.append(container);

const pushNotification = (title, description, type) => {
  container.insertAdjacentHTML('beforeend', `
    <div
      class="notification ${type}"
      data-qa="notification"
      style="position: static"
    >
      <h2 class="title">${title}</h2>

      <p>${description}</p>
    </div>
  `);

  const notification = document.querySelectorAll('.notification');

  notification.forEach(el => {
    setTimeout(() => el.remove(), 10000);
  });
};

// Edit cell on dblclick
const inputs = form.querySelectorAll('input, select');

function checkCellInput(input, cell, prev) {
  input.value.length <= 0
    ? cell.innerHTML = prev
    : cell.innerHTML = normalize(input.name, input.value);
}

tBody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const cellPrevValue = cell.innerHTML;
  const input = inputs[cell.cellIndex].cloneNode(true);

  input.style.width = `${parseInt(getComputedStyle(cell).width)}px`;
  input.classList.add('cell-input');
  input.value = normalize(input.name, cell.innerHTML);
  cell.innerHTML = '';
  cell.append(input);

  input.onblur = function() {
    try {
      valitadeInput(input);
      checkCellInput(input, cell, cellPrevValue);

      pushNotification('Success',
        'Employee was added to the table', 'success');
    } catch (error) {
      input.focus();
      pushNotification('Error', error.message, 'error');
    }
  };

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      input.blur();
    }
  });
});
