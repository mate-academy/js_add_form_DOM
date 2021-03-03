'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

thead.addEventListener('click', handleSortByCell);
thead.addEventListener('dblclick', handleSortByCellReverse);
tbody.addEventListener('click', handleSelectRow);

function handleSelectRow(ev) {
  const elementRow = ev.target.closest('tr');

  if (!elementRow || !tbody.contains(elementRow)) {
    return;
  }

  const checkingForClass = [...tbody.children]
    .some(row => row.className === 'active');

  if (checkingForClass === true) {
    [...tbody.children].forEach(row => row.classList.remove('active'));
  }
  elementRow.classList.add('active');
}

function converter(string) {
  return string.replace('$', '').replaceAll(',', '');
}

function handleSortByCell(ev) {
  const titleIndex = ev.target.closest('th').cellIndex;
  const title = ev.target.closest('th');
  const rowsForSorting = [...tbody.children];

  if (!title || !thead.contains(title)) {
    return;
  }

  switch (title.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      rowsForSorting.sort((current, next) => {
        const currentCellString = current.cells[titleIndex].innerText;
        const nextCellString = next.cells[titleIndex].innerText;

        return currentCellString.localeCompare(nextCellString);
      });
      break;

    case 'Age':
    case 'Salary':
      rowsForSorting.sort((current, next) => {
        const currentCellNum = current.cells[titleIndex].innerText;
        const nextCellNum = next.cells[titleIndex].innerText;
        const convertedCurrentNum = converter(currentCellNum);
        const convertedNextNum = converter(nextCellNum);

        return convertedCurrentNum - convertedNextNum;
      });
      break;
  }

  rows.forEach(row => tbody.removeChild(row));

  rowsForSorting.forEach(newRow => tbody.appendChild(newRow));
}

function handleSortByCellReverse(ev) {
  const titleIndexReverse = ev.target.closest('th').cellIndex;
  const titleReverse = ev.target.closest('th');
  const rowsForSorting = [...tbody.children];

  if (!titleReverse || !thead.contains(titleReverse)) {
    return;
  }

  switch (titleReverse.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      rowsForSorting.sort((current, next) => {
        const currentCellString = current.cells[titleIndexReverse].innerText;
        const nextCellString = next.cells[titleIndexReverse].innerText;

        return nextCellString.localeCompare(currentCellString);
      });
      break;

    case 'Age':
    case 'Salary':
      rowsForSorting.sort((current, next) => {
        const currentCellNum = current.cells[titleIndexReverse].innerText;
        const nextCellNum = next.cells[titleIndexReverse].innerText;
        const convertedCurrentNum = converter(currentCellNum);
        const convertedNextNum = converter(nextCellNum);

        return convertedNextNum - convertedCurrentNum;
      });
      break;
  }

  rows.forEach(row => tbody.removeChild(row));

  rowsForSorting.forEach(newRow => tbody.appendChild(newRow));
}

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.method = 'GET';
form.action = '#';

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
    <input
      class="cell-input name"
      type="text"
      name="name"
      data-qa="name"
      required
    >
  </label>
  <label>Position:
    <input
      class="cell-input position"
      type="text"
      name="position"
      data-qa="position"
      required
    >
  </label>
  <label>Office:
    <select
      class="cell-input office"
      name="office"
      data-qa="office"
      required
    >
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input
      class="cell-input age"
      type="number"
      name="age"
      data-qa="age"
      required
    >
  </label>
  <label>Salary:
    <input
      class="cell-input salary"
      type="number"
      name="salary"
      data-qa="salary"
      required
    >
  </label>
  <button type="submit">Save to table</button>
`);

document.body.append(form);

const saveButton = form.querySelector('button');

saveButton.addEventListener('click', saveToTable);

function conditionChecker(nameInput, position, age) {
  const minLengthOfName = 4;
  const minAge = 18;
  const maxAge = 90;

  if (nameInput.length < minLengthOfName) {
    pushNotification(
      150, 10,
      'Error invalid input',
      'The length of the name must be longer',
      'error'
    );
  }

  if (!position.length) {
    pushNotification(
      10, 10,
      'Error invalid input',
      'Position input required',
      'error'
    );
  }

  if (age < minAge || age > maxAge) {
    pushNotification(
      290, 10,
      'Error invalid input',
      'The age must be between 18 and 90',
      'error'
    );
  }
}

function saveToTable(ev) {
  const tr = document.createElement('tr');

  ev.preventDefault();

  const inputName = form.querySelector('.name').value;
  const inputPostion = form.querySelector('.position').value;
  const selectOffice = form.querySelector('.office').value;
  const inputAge = form.querySelector('.age').value;
  const inputSalary = +form.querySelector('.salary').value;

  conditionChecker(inputName, inputPostion, inputAge, inputSalary);

  if (
    inputPostion
    && inputSalary > 0
    && inputName.length >= 4
    && (inputAge >= 18 && inputAge <= 90)
  ) {
    tr.insertAdjacentHTML('afterbegin', `
      <td>${inputName}</td>
      <td>${inputPostion}</td>
      <td>${selectOffice}</td>
      <td>${inputAge}</td>
      <td>${'$' + inputSalary.toLocaleString('en')}</td>
  `);
    tbody.appendChild(tr);

    pushNotification(
      10, 10,
      'Success',
      'New employee successfuly added to the table',
      'success'
    );
  }
}

function pushNotification(
  positionTop,
  positionRight,
  title,
  description,
  type
) {
  const body = document.querySelector('body');
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';
  message.style.top = positionTop + 'px';
  message.style.right = positionRight + 'px';

  messageTitle.innerText = title;
  messageTitle.classList.add('title');

  messageDescription.innerText = description;

  message.append(messageTitle, messageDescription);

  body.append(message);

  setTimeout(() => message.remove(), 6000);
}
