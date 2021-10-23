'use strict';

const body = document.querySelector('body');
const rows = document.querySelectorAll('tr');
const bodyTable = document.querySelector('tbody');
const bodyRows = bodyTable.querySelectorAll('tr');
const foot = document.querySelector('tfoot');
const haed = document.querySelector('thead');

for (const row of rows) {
  row.children[0].classList.add('name');
  row.children[1].classList.add('position');
  row.children[2].classList.add('office');
  row.children[3].classList.add('age');
  row.children[4].classList.add('salary');
};

// 1. Implement table sorting by clicking on the title (in two directions).
let nameSort = 1;
let positionSort = 1;
let officeSort = 1;
let ageSort = 1;
let salarySort = 1;

const sort = (e) => {
  let newList;

  switch (true) {
    case e.target.classList.contains('name'):
      newList = [...bodyRows].sort((a, b) => {
        const first = a.firstElementChild.innerText;
        const second = b.firstElementChild.innerText;

        if (nameSort % 2) {
          return first.localeCompare(second);
        } else {
          return second.localeCompare(first);
        }
      });
      nameSort += 1;
      positionSort = 1;
      officeSort = 1;
      ageSort = 1;
      salarySort = 1;
      break;

    case e.target.classList.contains('position'):
      newList = [...bodyRows].sort((a, b) => {
        const first = a.children[1].innerText;
        const second = b.children[1].innerText;

        if (positionSort % 2) {
          return first.localeCompare(second);
        } else {
          return second.localeCompare(first);
        }
      });
      nameSort = 1;
      positionSort += 1;
      officeSort = 1;
      ageSort = 1;
      salarySort = 1;
      break;

    case e.target.classList.contains('office'):
      newList = [...bodyRows].sort((a, b) => {
        const first = a.children[2].innerText;
        const second = b.children[2].innerText;

        if (officeSort % 2) {
          return first.localeCompare(second);
        } else {
          return second.localeCompare(first);
        }
      });
      nameSort = 1;
      positionSort = 1;
      officeSort += 1;
      ageSort = 1;
      salarySort = 1;
      break;

    case e.target.classList.contains('age'):
      newList = [...bodyRows].sort((a, b) => {
        if (ageSort % 2) {
          return +a.children[3].innerText - +b.children[3].innerText;
        } else {
          return +b.children[3].innerText - +a.children[3].innerText;
        }
      });
      nameSort = 1;
      positionSort = 1;
      officeSort = 1;
      ageSort += 1;
      salarySort = 1;
      break;

    case e.target.classList.contains('salary'):
      newList = [...bodyRows].sort((a, b) => {
        function GetNumSalary(item) {
          const element = item.children[4].innerText;

          return Number(element.slice(1).split(',').join(''));
        }

        if (salarySort % 2) {
          return (GetNumSalary(a) - GetNumSalary(b));
        } else {
          return (GetNumSalary(b) - GetNumSalary(a));
        }
      });
      nameSort = 1;
      positionSort = 1;
      officeSort = 1;
      ageSort = 1;
      salarySort += 1;
      break;
  }

  for (const item of newList) {
    bodyTable.append(item);
  };
};

foot.addEventListener('click', sort);
haed.addEventListener('click', sort);

// 2. When user clicks on a row, it should become selected.

const selectedRow = (e) => {
  if (e.target.tagName !== 'TD') {
    for (const row of bodyRows) {
      row.classList.remove('active');
    };
  } else {
    for (const row of bodyRows) {
      row.classList.remove('active');
    };
    e.target.parentElement.classList.add('active');
  }
};

document.addEventListener('click', selectedRow);

// 3. Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.
// 4. Show notification if form data is invalid

body.insertAdjacentHTML('beforeend', `
<form action="get" class="new-employee-form">
<label>
Name:
<input type="text" name="name" data-qa="name" required>
</label>
<label>
Position:
<input type="text" name="position" data-qa="position" required>
</label>
<label>
Office:
<select name="office" data-qa="office">
  <option value="tokyo" selected>Tokyo</option>
  <option value="singapore">Singapore</option>
  <option value="london">London</option>
  <option value="newYork">New York</option>
  <option value="edinburgh">Edinburgh</option>
  <option value="sanFrancisco">San Francisco</option>
</select>
</label>
<label>
Age:
<input type="number" name="age" data-qa="age" required>
</label>
<label>
Salary:
<input type="number" name="salary" data-qa="salary" required>
</label>
<button type="submit">Save to table</button>
</form>
`);

const SaveToTable = document.querySelector('button');
const form = document.querySelector('form');

const addEmployees = (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const newEmployee = document.createElement('tr');
  const nameEmployee = data.get('name');
  const positionEmployee = data.get('position');
  const officeEmployee = data.get('office');
  const ageEmployee = data.get('age');
  const salaryEmployee = data.get('salary');
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');

  if (nameEmployee.length > 3 & ageEmployee < 90 & ageEmployee > 17) {
    newEmployee.insertAdjacentHTML('beforeend', `
      <td class="name">${nameEmployee}</td>
      <td class="position">${positionEmployee}</td>
      <td class="office">${officeEmployee}</td>
      <td class="age">${ageEmployee}</td>
      <td class="salary">$${(+salaryEmployee).toLocaleString('en-US')}</td>
    `);

    notification.classList.add('success');

    notification.innerHTML = '<h4 class="title">'
    + 'Employee added successfully'
    + '</h4>';

    bodyTable.insertAdjacentElement('beforeend', newEmployee);
  } else {
    notification.classList.add('error');

    notification.innerHTML = '<h4 class="title">'
    + 'Invalid data'
    + '</h4>';
  };
  body.insertAdjacentElement('beforeend', notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

SaveToTable.addEventListener('click', addEmployees);

// 5. Implement editing of table cells by double-clicking on it.

const changeCell = (e) => {
  e.preventDefault();

  if (e.target.tagName === 'TD') {
    const initialValue = e.target.innerText;
    const cellInput = document.createElement('input');

    cellInput.classList.add('cell-input');
    e.target.innerText = '';
    e.target.insertAdjacentElement('beforeend', cellInput);
    cellInput.focus();

    const saveInput = (passage) => {
      e.preventDefault();

      if (passage.code === undefined || passage.code === 'Enter') {
        const resultValue = (cellInput.value === '')
          ? initialValue
          : cellInput.value;

        e.target.innerText = resultValue;
      };
    };

    document.addEventListener('click', saveInput);
    document.addEventListener('keyup', saveInput);
  };
};

document.addEventListener('dblclick', changeCell);
