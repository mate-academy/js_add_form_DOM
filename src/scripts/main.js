'use strict';

const ASC = 'asc';
const DESC = 'desc';

const pushNotification = (type, description) => {
  const message = document.createElement('div');
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  message.classList.add('notification', type);
  message.classList.add(type === 'Success' ? 'success' : 'error');

  message.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  message.style.top = '10px';
  message.style.right = '10px';

  message.setAttribute('data-qa', 'notification');

  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 5000);
};

const table = document.querySelector('table');
const headers = document.querySelectorAll('th');
const people = [];

const sortOrder = {
  name: ASC,
  position: ASC,
  office: ASC,
  age: ASC,
  salary: ASC,
};

const initializePeopleArray = () => {
  const trs = document.querySelectorAll('tr');

  trs.forEach((item, index) => {
    if (index === 0 || index === trs.length - 1) {
      return;
    }

    item.addEventListener('click', () => {
      trs.forEach((tr) => tr.classList.remove('active'));
      item.classList.add('active');
    });

    const person = {
      name: item.children[0].textContent,
      position: item.children[1].textContent,
      office: item.children[2].textContent,
      age: parseInt(item.children[3].textContent),
      salary: parseFloat(item.children[4].textContent.replace(/[$,]/g, '')),
    };

    people.push(person);
  });
};

const handleSort = (e) => {
  switch (e.target.innerText) {
    case 'Name':
      if (sortOrder.name === ASC) {
        people.sort((a, b) => a.name.localeCompare(b.name));
        sortOrder.name = DESC;
        break;
      }

      people.sort((a, b) => b.name.localeCompare(a.name));
      sortOrder.name = ASC;
      break;

    case 'Position':
      if (sortOrder.position === ASC) {
        people.sort((a, b) => a.position.localeCompare(b.position));
        sortOrder.position = DESC;
        break;
      }

      people.sort((a, b) => b.position.localeCompare(a.position));
      sortOrder.position = ASC;
      break;

    case 'Office':
      if (sortOrder.office === ASC) {
        people.sort((a, b) => a.office.localeCompare(b.office));
        sortOrder.office = DESC;
        break;
      }

      people.sort((a, b) => b.office.localeCompare(a.office));
      sortOrder.office = ASC;
      break;

    case 'Age':
      if (sortOrder.age === ASC) {
        people.sort((a, b) => a.age - b.age);
        sortOrder.age = DESC;
        break;
      }

      people.sort((a, b) => b.age - a.age);
      sortOrder.age = ASC;
      break;

    case 'Salary':
      if (sortOrder.salary === ASC) {
        people.sort((a, b) => a.salary - b.salary);
        sortOrder.salary = DESC;
        break;
      }

      people.sort((a, b) => b.salary - a.salary);
      sortOrder.salary = ASC;
      break;
  }

  while (table.rows.length > 2) {
    table.deleteRow(1);
  }

  people.forEach((person) => {
    const row = document.createElement('tr');

    const salary = person.salary.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    row.innerHTML = `
      <td>${person.name}</td>
      <td>${person.position}</td>
      <td>${person.office}</td>
      <td>${person.age}</td>
      <td>${salary}</td>
    `;

    table.insertBefore(row, table.lastElementChild);
  });
};

const addEventListeners = () => {
  headers.forEach((header, index) => {
    const columnName = header.innerText.toLowerCase().replace(' ', '-');

    header.setAttribute('data-qa', `header-${columnName}`);
    header.addEventListener('click', (e) => handleSort(e));
  });
};

initializePeopleArray();
addEventListeners();

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('novalidate', 'true');

const attributes = ['name', 'position', 'office', 'age', 'salary'];

attributes.forEach((item) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const label = document.createElement('label');

  label.innerText = `${capitalize(item)}:`;
  label.setAttribute('for', item);

  if (item === 'office') {
    const select = document.createElement('select');
    const offices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    select.setAttribute('name', item);
    select.setAttribute('data-qa', item);

    offices.forEach((office) => {
      const option = document.createElement('option');

      option.setAttribute('value', office);
      option.innerText = office;
      select.id = item;
      select.appendChild(option);
      select.setAttribute('required', 'true');
    });

    label.appendChild(select);
    form.appendChild(label);

    return;
  }

  const input = document.createElement('input');

  input.setAttribute('name', item);
  input.setAttribute('data-qa', item);
  input.setAttribute('required', 'true');
  input.id = item;

  if (item === 'age' || item === 'salary') {
    input.setAttribute('type', 'number');
  } else {
    input.setAttribute('type', 'text');
  }

  label.appendChild(input);
  form.appendChild(label);
});

const button = document.createElement('button');

button.type = 'submit';
button.innerText = 'Save to table';
form.appendChild(button);

document.body.appendChild(form);

const onSubmit = (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const isEmpty = attributes.some((item) => {
    const value = data.get(item).trim();

    return value === '';
  });

  if (isEmpty) {
    pushNotification('error', 'All fields are required');

    return;
  }

  const newEmployee = {
    name: data.get('name').trim(),
    position: data.get('position').trim(),
    office: data.get('office').trim(),
    age: parseInt(data.get('age').trim()),
    salary: parseFloat(data.get('salary').trim()),
  };

  if (newEmployee.name.length < 4) {
    pushNotification('error', 'Name value has less than 4 letters');

    return;
  }

  if (newEmployee.position.length < 1) {
    pushNotification('error', 'Position value can not be empty');

    return;
  }

  if (newEmployee.salary < 1) {
    pushNotification('error', 'Salary can not be empty');

    return;
  }

  if (newEmployee.age < 18 || newEmployee.age > 90) {
    pushNotification('error', 'Age value is less than 18 or more than 90');

    return;
  }

  people.push(newEmployee);

  const row = document.createElement('tr');

  const salaryFormatted = newEmployee.salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  row.innerHTML = `
    <td>${newEmployee.name}</td>
    <td>${newEmployee.position}</td>
    <td>${newEmployee.office}</td>
    <td>${newEmployee.age}</td>
    <td>${salaryFormatted}</td>
  `;

  table.insertBefore(row, table.lastElementChild);

  row.addEventListener('click', () => {
    const trs = document.querySelectorAll('tr');

    trs.forEach((tr) => tr.classList.remove('active'));
    row.classList.add('active');
  });

  form.reset();
  pushNotification('success', 'Employee successfully added to the table');
};

form.addEventListener('submit', onSubmit);
