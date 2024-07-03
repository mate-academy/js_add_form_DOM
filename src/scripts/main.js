'use strict';

const navBar = document.querySelector('thead tr');
const tableBody = document.querySelector('tbody');
const form = document.createElement('form');
const dataAttributes = ['name', 'position', 'office', 'age', 'salary'];
const button = document.createElement('button');
const page = document.querySelector('body');

button.type = 'submit';
button.textContent = 'Save to table';

function capitalizeFirstLetter(str) {
  if (str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

form.classList.add('new-employee-form');

let sortWay = true;

const handleToNumbers = (str) => {
  return +str.replace(/[^0-9.-]+/g, '');
};

function sortTable(value, columnIndex) {
  const rowsArray = Array.from(tableBody.querySelectorAll('tr'));

  rowsArray.sort((a, b) => {
    const cellA = a.cells[columnIndex].innerText.toLowerCase();
    const cellB = b.cells[columnIndex].innerText.toLowerCase();

    if (sortWay) {
      switch (value) {
        case 'name':
        case 'position':
        case 'office':
          return cellA.localeCompare(cellB);

        case 'age':
          return parseInt(cellA) - parseInt(cellB);

        case 'salary':
          return handleToNumbers(cellA) - handleToNumbers(cellB);

        default:
          return null;
      }
    } else {
      switch (value) {
        case 'name':
        case 'position':
        case 'office':
          return cellB.localeCompare(cellA);

        case 'age':
          return parseInt(cellB) - parseInt(cellA);

        case 'salary':
          return handleToNumbers(cellB) - handleToNumbers(cellA);

        default:
          return null;
      }
    }
  });

  rowsArray.forEach((row) => tableBody.appendChild(row));
  sortWay = !sortWay;
}

navBar.addEventListener('click', (action) => {
  const activeFilter = action.target.closest('th');

  if (activeFilter) {
    const value = activeFilter.textContent.toLowerCase().trim();
    const columnIndex = action.target.cellIndex;

    sortTable(value, columnIndex);
  }
});

tableBody.addEventListener('click', (action) => {
  const clickedRow = action.target.closest('tr');

  if (clickedRow) {
    tableBody.querySelectorAll('tr').forEach((row) => {
      row.classList.remove('active');
    });

    clickedRow.classList.add('active');
  }
});

const handleAddInputs = () => {
  dataAttributes.forEach((attribute) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    switch (attribute) {
      case 'name':
      case 'position':
        input.type = 'text';
        input.name = attribute;
        input.dataset.qa = attribute;

        label.htmlFor = input.id;
        label.textContent = capitalizeFirstLetter(attribute);

        form.appendChild(label);
        label.appendChild(input);
        break;

      case 'office':
        const select = document.createElement('select');
        const cities = [
          'Tokyo',
          'Singapore',
          'London',
          'New York',
          'Edinburgh',
          'San Francisco',
        ];

        select.name = attribute;
        select.required = true;
        select.dataset.qa = attribute;

        cities.forEach((city) => {
          const option = document.createElement('option');

          option.value = city;
          option.textContent = city;
          select.appendChild(option);
        });

        label.textContent = capitalizeFirstLetter(attribute);

        form.appendChild(label);
        label.appendChild(select);
        break;

      case 'age':
        input.type = 'number';
        input.name = attribute;
        input.dataset.qa = attribute;

        label.htmlFor = input.id;
        label.textContent = capitalizeFirstLetter(attribute);

        form.appendChild(label);
        label.appendChild(input);
        break;

      case 'salary':
        input.type = 'number';
        input.name = attribute;
        input.dataset.qa = attribute;

        label.htmlFor = input.id;
        label.textContent = capitalizeFirstLetter(attribute);

        form.appendChild(label);
        label.appendChild(input);
        break;
    }
  });
};

function showNotification(text, type) {
  const notification = document.createElement('div');
  const notificationMessage = document.createElement('span');

  notificationMessage.setAttribute('class', 'title');
  notification.setAttribute('class', 'notification');
  notification.setAttribute('data-qa', 'notification');
  notification.style.display = 'flex';
  notification.style.justifyContent = 'center';
  notification.style.alignItems = 'center';
  notification.style.textAlign = 'center';
  notificationMessage.textContent = text;

  if (type === 'error') {
    notification.classList.add('error');
  } else {
    notification.classList.add('success');
  }

  notification.append(notificationMessage);
  page.append(notification);

  setTimeout(() => notification.remove(), 5000);
}

const handleAddEmployee = (action) => {
  action.preventDefault();

  const nameInput = form.querySelector('input[name="name"]');
  const positionInput = form.querySelector('input[name="position"]');
  const officeSelect = form.querySelector('select[name="office"]');
  const ageInput = form.querySelector('input[name="age"]');
  const salaryInput = form.querySelector('input[name="salary"]');

  const warning = [];

  if (nameInput.value.trim().length < 4) {
    warning.push('Name should be at least 4 symbols length.');
  }

  if (!positionInput.value) {
    warning.push('Position field should be filled.');
  }

  if (positionInput.value.trim() === '' && positionInput.value) {
    warning.push('Position field should not contain only spaces.');
  }

  if (!salaryInput.value) {
    warning.push('Salary field should be filled.');
  }

  if (+salaryInput.value < 0) {
    warning.push('Salary field should be with a positive number.');
  }

  if (+salaryInput.value === 0) {
    warning.push('Salary should be bigger than zero.');
  }

  if (+ageInput.value < 18 || +ageInput.value > 90) {
    warning.push('Age should be between 18 and 90 y.o.');
  }

  if (warning.length > 0) {
    return showNotification(warning.join('\n'), 'error');
  }

  const newRow = document.createElement('tr');
  const newName = document.createElement('td');
  const newPosition = document.createElement('td');
  const newOffice = document.createElement('td');
  const newAge = document.createElement('td');
  const newSalary = document.createElement('td');

  newName.textContent = capitalizeFirstLetter(nameInput.value.trim());
  newPosition.textContent = capitalizeFirstLetter(positionInput.value.trim());
  newOffice.textContent = officeSelect.value;
  newAge.textContent = ageInput.value;
  newSalary.textContent = `$${(+salaryInput.value).toLocaleString('en-US')}`;

  newRow.append(newName, newPosition, newOffice, newAge, newSalary);
  tableBody.append(newRow);

  form.reset();

  return showNotification('Employee successfully added.', 'success');
};

handleAddInputs();
form.appendChild(button);
document.body.appendChild(form);

button.addEventListener('click', handleAddEmployee);
