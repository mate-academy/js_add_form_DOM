'use strict';

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const rows = tableBody.querySelectorAll('tr');

// sort table

const columnSalary = 4;
let sortDirection = 'asc';

function convertSalary(salary) {
  const noCurrency = salary.slice(1);

  return +noCurrency.split(',').join('');
}

tableHead.addEventListener('click', e => {
  const columnIndex = e.target.cellIndex;

  const sortColumn = [...tableBody.children].sort((a, b) => {
    const colA = a.querySelectorAll('td')[columnIndex].innerText;
    const colB = b.querySelectorAll('td')[columnIndex].innerText;

    if (columnIndex === columnSalary) {
      return convertSalary(colA) - convertSalary(colB);
    } else {
      return colA.localeCompare(colB);
    }
  });

  if (sortDirection === 'desc') {
    sortColumn.reverse();
    sortDirection = 'asc';
  } else {
    sortDirection = 'desc';
  }

  sortColumn.forEach(item => tableBody.append(item));
});

// add class active to selected row

[...rows].forEach((row, index) => {
  row.addEventListener('click', e => {
    [...rows].forEach(line => {
      line.classList.remove('active');
    });

    if (index !== 0) {
      row.classList.add('active');
    }
  });
});

// notifications

const pushNotification = (posTop, posRight, title, description, type) => {
  const body = document.querySelector('body');
  const div = document.createElement('div');
  const divTitle = document.createElement('h2');
  const divDescription = document.createElement('p');

  div.classList = 'notification ' + type;
  divTitle.classList = 'title';

  divTitle.textContent = title;
  divDescription.textContent = description;

  body.append(div);
  div.append(divTitle);
  div.append(divDescription);

  div.style.top = posTop + 'px';
  div.style.right = posRight + 'px';

  setTimeout(() => {
    div.remove();
  }, 3000);
};

// add form

const form = document.createElement('form');

form.classList.add('new-employee-form');

// Name
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.setAttribute('name', 'name');
nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameInput.required = true;
nameLabel.appendChild(nameInput);
form.appendChild(nameLabel);

// Position
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.setAttribute('name', 'position');
positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionInput.required = true;
positionLabel.appendChild(positionInput);
form.appendChild(positionLabel);

// Office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.setAttribute('name', 'office');
officeSelect.setAttribute('data-qa', 'office');
officeSelect.required = true;

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco'];

offices.forEach(office => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  officeSelect.appendChild(option);
});

officeLabel.appendChild(officeSelect);
form.appendChild(officeLabel);

// Age
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.setAttribute('name', 'age');
ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageInput.required = true;
ageLabel.appendChild(ageInput);
form.appendChild(ageLabel);

// Salary
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.required = true;
salaryLabel.appendChild(salaryInput);
form.appendChild(salaryLabel);

// Button
const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

// Add form submit event listener
form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Get form data
  const person = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value;
  const age = parseInt(ageInput.value);
  const salary = parseFloat(salaryInput.value);

  // error - no new row

  if (person.length < 4) {
    pushNotification(450, 10, 'Error!',
      'Name must have minimum 4 letters', 'error');

    return;
  }

  if (position.length === 0) {
    pushNotification(450, 10, 'Error!',
      'Position must have minimum 1 letter', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(450, 10, 'Error!',
      'Age should be more than 18 and less than 90', 'error');

    return;
  }

  if (salary < 0) {
    pushNotification(450, 10, 'Error!',
      'Salary should be more than 0', 'error');

    return;
  }

  // new row
  const newRow = tableBody.insertRow();

  const nameCell = newRow.insertCell();

  nameCell.textContent = person;

  const positionCell = newRow.insertCell();

  positionCell.textContent = position;

  const officeCell = newRow.insertCell();

  officeCell.textContent = office;

  const ageCell = newRow.insertCell();

  ageCell.textContent = age;

  const salaryCell = newRow.insertCell();

  salaryCell.textContent = '$' + salary;

  // notifications if statements

  pushNotification(450, 10, 'Success!',
    'Employee successfully added', 'success');
});

// Append the form to the document body
document.body.appendChild(form);

// changing cell text

tableBody.addEventListener('dblclick', (e) => {
  let input = document.createElement('input');
  const td = e.target;
  const cellIndex = td.cellIndex;

  input.style.width = getComputedStyle(td).width;
  input.classList.add('cell-input');

  const content = e.target.textContent;

  e.target.textContent = '';

  if (cellIndex > 2) {
    input.setAttribute('type', 'number');
  }

  // cities

  if (cellIndex === 2) {
    const selectCity = document.createElement('select');
    const cities = [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ];

    cities.forEach((option) => {
      const city = document.createElement('option');

      city.textContent = option;
      selectCity.append(city);
    });
    input = selectCity;
  }

  // append input
  e.target.append(input);

  input.focus();

  input.addEventListener('blur', () => {
    const valueInput = input.value;

    if (valueInput.length > 3 && td.cellIndex <= 2) {
      td.textContent = valueInput;
    } else if (cellIndex === 3 && +valueInput > 17 && +valueInput < 91) {
      td.textContent = valueInput;
    } else if (cellIndex === 4 && +valueInput > 0) {
      td.textContent = '$' + (+valueInput).toLocaleString('en-US');
    } else {
      td.textContent = content;
    }

    input.remove();
  });

  tableBody.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter') {
      const valueInput = input.value;

      if (valueInput.length > 3 && td.cellIndex <= 2) {
        td.textContent = valueInput;
      } else if (cellIndex === 3 && +valueInput > 17 && +valueInput < 91) {
        td.textContent = valueInput;
      } else if (cellIndex === 4 && +valueInput > 0) {
        td.textContent = '$' + (+valueInput).toLocaleString('en-US');
      } else {
        td.textContent = content;
      }
    }
  });
});
