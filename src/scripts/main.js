'use strict';

const body = document.body;
const tableBody = body.querySelector('tbody');
const tableHead = body.querySelector('thead');

const minNameLength = 4;
const minPositionLength = 4;
const minAge = 18;
const maxAge = 90;

let isSortedAscendingOrder = false;
let lastSortedColumnIndex = -1;

// creating and adding form

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.action = '#';
form.method = 'GET';

const formInnerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" type="text" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;

form.insertAdjacentHTML('afterbegin', formInnerHTML);
body.append(form);

// sorting columns

tableHead.addEventListener('click', e => {
  const column = e.target.closest('th');

  if (!column) {
    return;
  }

  const columnIndex = [...column.parentElement.children]
    .findIndex(child => child === column);
  const columnName = column.textContent;
  let sortedRows;

  if (columnIndex !== lastSortedColumnIndex) {
    isSortedAscendingOrder = false;
    lastSortedColumnIndex = columnIndex;
  }

  switch (columnName) {
    case 'Name':
    case 'Position':
    case 'Office':
      sortedRows = [...tableBody.children].sort((currentRow, nextRow) => {
        return isSortedAscendingOrder
          ? stringsCompare(
            nextRow.children[columnIndex].textContent,
            currentRow.children[columnIndex].textContent,
          )
          : stringsCompare(
            currentRow.children[columnIndex].textContent,
            nextRow.children[columnIndex].textContent,
          );
      });
      break;
    case 'Age':
    case 'Salary':
      sortedRows = [...tableBody.children].sort((currentRow, nextRow) => {
        return isSortedAscendingOrder
          ? numbersCompare(
            formatNumber(nextRow.children[columnIndex].textContent),
            formatNumber(currentRow.children[columnIndex].textContent),
          )
          : numbersCompare(
            formatNumber(currentRow.children[columnIndex].textContent),
            formatNumber(nextRow.children[columnIndex].textContent),
          );
      });
      break;
  }

  isSortedAscendingOrder = !isSortedAscendingOrder;
  tableBody.append(...sortedRows);
});

// highlight row

tableBody.addEventListener('click', e => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const highlightedRow = [...tableBody.children].find(
    currentRow => currentRow.classList.contains('active')
  );

  if (highlightedRow && highlightedRow !== row) {
    highlightedRow.classList.remove('active');
  }

  row.classList.toggle('active');
});

// process the form

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const newEmployeeData = Object.fromEntries(formData.entries());

  if (!validateFormData(newEmployeeData)) {
    createNotification('error', 'Error!', 'Wrong data!', 20, 20);
    form.reset();

    return;
  }

  createNotification('success', 'Success!', 'Data successfully added.', 20, 20);

  const createdRow = `
    <tr>
      <td>${newEmployeeData.name}</td>
      <td>${newEmployeeData.position}</td>
      <td>${newEmployeeData.office}</td>
      <td>${formatNumber(newEmployeeData.age)}</td>
      <td>${formatToSalary(formatNumber(newEmployeeData.salary))}</td>
    </tr>
  `;

  tableBody.insertAdjacentHTML('afterbegin', createdRow);
});

// create notification

function createNotification(type, title, description, posTop, posRight) {
  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const paragraphElement = document.createElement('p');

  notification.classList.add('notification', type);
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';
  notification.setAttribute('data-qa', 'notification');

  titleElement.classList.add('title');
  titleElement.style.fontSize = '18px';
  titleElement.textContent = title;

  paragraphElement.textContent = description;

  notification.append(titleElement, paragraphElement);
  body.append(notification);

  setTimeout(() => notification.remove(), 2000);
}

function validateFormData(employee) {
  const employeeName = employee.name;
  const employeeAge = formatNumber(employee.age);
  const employeePosition = employee.position;

  if (
    employeeName.length < minNameLength || employeePosition < minPositionLength
  ) {
    return false;
  }

  if (employeeAge < minAge || employeeAge > maxAge) {
    return false;
  }

  return true;
}

function formatToSalary(salary) {
  const splitedSalary = salary.toString().split('').reverse();
  const formatedSalary = [];

  for (let i = 0; i < splitedSalary.length; i++) {
    formatedSalary.push(splitedSalary[i]);

    if ((i + 1) % 3 === 0 && i !== splitedSalary.length - 1) {
      formatedSalary.push(',');
    }
  }

  formatedSalary.push('$');

  return formatedSalary.reverse().join('');
}

function formatNumber(number) {
  return +number.replace(/[^0-9.]/g, '');
}

function stringsCompare(first, second) {
  return first.localeCompare(second);
}

function numbersCompare(first, second) {
  return first - second;
}
