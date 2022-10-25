'use strict';

const heading = document.querySelector('thead').firstElementChild;
const headingItems = [...heading.querySelectorAll('th')];
const tableBody = document.querySelector('tbody');
const tableRows = [...tableBody.children];

headingItems.forEach(item => item.setAttribute('class', 'column'));

function setDataAttribut(collection) {
  for (const item of collection.slice(0, 3)) {
    item.dataset.type = 'text';
  }
  collection[3].dataset.type = 'number';
  collection[4].dataset.type = 'salary';
}

setDataAttribut(headingItems);

const salaryToNumber = (cell) => {
  return cell.slice(1).split(',').join('');
};

const numberToSalary = (elem) => {
  return `$${Number(elem).toLocaleString()}`;
};

function tableSort(column) {
  const index = headingItems.indexOf(column);
  const data = column.dataset;

  const callbackSort = (rowA, rowB) => {
    const one = rowA.children[index].innerText;
    const two = rowB.children[index].innerText;
    let first = one;
    let second = two;

    if (data.order === 'asc') {
      first = two;
      second = one;
    }

    switch (data.type) {
      case 'text':
        return first.localeCompare(second);
      case 'salary':
        return salaryToNumber(first) - salaryToNumber(second);
      case 'number':
        return first - second;
    }
  };
  const sorted = [...tableBody.children].sort(callbackSort);

  tableRows.forEach(item => item.remove());
  sorted.forEach(item => tableBody.append(item));

  if (!data.order || data.order === 'desc') {
    data.order = 'asc';
  } else {
    data.order = 'desc';
  }
}

heading.addEventListener('click', (e) => {
  const item = e.target.closest('.column');

  if (!item || !heading.contains(item)) {
    return;
  }

  tableSort(item);
});

tableRows.forEach(item => item.setAttribute('class', 'row'));

tableBody.addEventListener('click', (e) => {
  const item = e.target.closest('.row');

  if (!item || !tableBody.contains(item)) {
    return;
  }

  for (const cell of tableRows) {
    if (cell.classList.contains('active')) {
      cell.classList.remove('active');
      [...cell.children].forEach(unit => unit.classList.remove('cell-active'));
    }
  }

  item.classList.add('active');

  [...item.children].forEach(cell => cell.classList.add('cell-active'));
});

const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');
form.autocomplete = 'off';
document.body.insertBefore(form, document.body.lastChild);

const inputs = ['name', 'position', 'age', 'salary'];

const inputsArray = inputs.map(item =>
  `<label for = "${item}">${item[0].toUpperCase() + item.slice(1)}:\
  <input name="${item}" type="text" id = "${item}" \
  data-qa = "${item}"></label>`
);

inputsArray.forEach(item => form.insertAdjacentHTML('beforeend', item));

const age = document.querySelector('#age');
const salary = document.querySelector('#salary');

age.type = 'number';
salary.type = 'number';

const selectLabel = document.createElement('label');

selectLabel.htmlFor = 'office';

const select = document.createElement('select');

select.setAttribute('id', 'office');
select.setAttribute('name', 'office');
select.dataset.qa = 'office';
select.setAttribute('required', '');

const optionsValues = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];
const optionCollection = optionsValues.map(item =>
  `<option data-id="${item}">${item}</option>`
);

optionCollection.forEach(item =>
  select.insertAdjacentHTML('beforeend', item));

selectLabel.append(select);

form.insertBefore(selectLabel, form.children[2]);

selectLabel.insertAdjacentText('afterbegin', 'Office:');

const button = document.createElement('button');

button.type = 'submit';

button.innerText = 'Save to table';

form.append(button);

function containsNumber(str) {
  return str.split('').some(item => '0123456789'.includes(item));
}

const transformUpperCase = (person) => {
  const nameArr = person.split(' ');

  return nameArr.map(item => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ');
};

const addRow = (e) => {
  e.preventDefault();

  const newTr = document.createElement('tr');

  newTr.className = 'row';

  const data = new FormData(form);
  const dataInput = Object.fromEntries(data.entries());

  newTr.innerHTML = `
      <td>${transformUpperCase(dataInput.name)}</td>
      <td>${transformUpperCase(dataInput.position)}</td>
      <td>${dataInput.office}</td>
      <td>${dataInput.age}</td>
      <td>${numberToSalary(dataInput.salary)}</td>
  `;

  if (dataInput.name.length < 4 || containsNumber(dataInput.name)) {
    return notification(wrongNameMessage, 'error');
  }

  if (dataInput.position.length <= 0) {
    return notification(wrongPosition, 'error');
  }

  if (dataInput.age < 18) {
    return notification(smallAgeMessage, 'error');
  }

  if (dataInput.age > 90) {
    return notification(bigAgeMessage, 'error');
  }

  notification(success, 'success');

  tableBody.append(newTr);
  form.reset();
};

form.addEventListener('submit', addRow);

const alertTable = document.createElement('div');

alertTable.style.top = '5px';
alertTable.style.right = '-300px';
alertTable.style.position = 'fixed';
alertTable.style.textAlign = 'center';
alertTable.style.display = 'flex';
alertTable.style.alignItems = 'center';
alertTable.style.justifyContent = 'center';
alertTable.style.color = '#5A5A5A';
alertTable.dataset.qa = 'notification';
alertTable.style.transition = 'all 1s ease';
document.body.append(alertTable);

const smallAgeMessage = 'Sorry, you are too young for this game';
const bigAgeMessage = 'Sorry, you are too old for this game';
const wrongNameMessage = 'Please, enter valid name';
const wrongPosition = 'Please, enter valid position';
const wrongSalaryMessage = 'Please, enter valid salary';
const success = 'Employee successfully added';

const notification = (message, type) => {
  const adjust = () => {
    const element = document.querySelector(`.${type}`);

    element.style.right = '-300px';
    element.style.opacity = '0';
  };

  alertTable.className = `notification ${type}`;
  alertTable.innerHTML = `<p class="title">${message}</p>`;
  alertTable.style.right = '5px';
  alertTable.style.opacity = '1';

  setTimeout(adjust, '2800');
};

function addInput(cell, index) {
  const inputCollection = [...document.getElementsByTagName('label')]
    .map(item => item.firstElementChild);
  const input = inputCollection[index].cloneNode(true);

  if (index === 4) {
    input.setAttribute('value', `${salaryToNumber(cell.innerText)}`);
  } else {
    input.setAttribute('value', `${cell.innerText}`);
  }
  input.className = 'cell-input';
  cell.append(input);
  cell.firstChild.remove();

  if (index === 2) {
    const option = tableBody.querySelector(`[data-id="${cell.firstElementChild
      .getAttribute('value')}"]`);

    option.setAttribute('selected', '');
  }
  document.querySelector('.cell-input').focus();
}

tableBody.addEventListener('dblclick', (e) => {
  const cellInput = e.target.closest('.cell-active');
  const activeCell = document.querySelector('.cell-active--mod');

  if (!cellInput || !tableBody.contains(cellInput)) {
    return;
  }

  if (activeCell) {
    activeCell.classList.remove('cell-active--mod');
  }
  cellInput.className += '--mod';

  const indexCell = [...document.querySelector('.row.active').children]
    .findIndex(item => item.className === 'cell-active--mod');

  addInput(e.target, indexCell);
});

const validationNameData = (cell, input) => {
  if (input.value.length < 4 || containsNumber(input.value)) {
    return notification(wrongNameMessage, 'error');
  }
  cell.innerText = transformUpperCase(input.value);
  modAction(cell, input);
};

const validationPositionData = (cell, input) => {
  cell.innerText = transformUpperCase(input.value);
  modAction(cell, input);
};

const validationOfficeData = (cell, input) => {
  cell.innerText = `${input.value}`;
  modAction(cell, input);
};

const validationAgeData = (cell, input) => {
  if (input.value < 18) {
    return notification(smallAgeMessage, 'error');
  }

  if (input.value > 90) {
    return notification(bigAgeMessage, 'error');
  }
  cell.innerText = `${input.value}`;
  modAction(cell, input);
};

const validationSalaryData = (cell, input) => {
  if (input.value <= 0) {
    return notification(wrongSalaryMessage, 'error');
  }
  cell.innerText = `${numberToSalary(input.value)}`;
  modAction(cell, input);
};

function modAction(cell, input) {
  input.remove();
  cell.classList.remove('cell-active--mod');

  if (!input.value) {
    cell.innerText = `${input.getAttribute('value')}`;
  }
}

const itemMod = () => {
  const inputMod = document.querySelector('.cell-input');
  const cellMod = document.querySelector('.cell-active--mod');

  if (!inputMod || !tableBody.contains(inputMod)) {
    return;
  }

  switch (`${inputMod.name}`) {
    case 'name':
      return validationNameData(cellMod, inputMod);
    case 'position':
      return validationPositionData(cellMod, inputMod);
    case 'office':
      return validationOfficeData(cellMod, inputMod);
    case 'age':
      return validationAgeData(cellMod, inputMod);
    case 'salary':
      return validationSalaryData(cellMod, inputMod);
  }
};

tableBody.addEventListener('blur', itemMod, true);

tableBody.addEventListener('keydown', (e) => {
  if (e.code !== 'Enter') {
    return;
  }
  itemMod();
});
