'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const newForm = document.createElement('form');
const body = document.querySelector('body');

body.appendChild(newForm);
newForm.setAttribute('class', 'new-employee-form');

const button = document.createElement('button');

thead.addEventListener('click', (e) => {
  const target = e.target;

  if (target.tagName === 'TH') {
    const index = target.cellIndex;

    sortTable(index);
  }
});

function sortTable(indexColumn) {
  const column = indexColumn;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    if (column === 4) {
      const aValue = a.cells[column].innerText.replace(/[$,]/g, '');
      const bValue = b.cells[column].innerText.replace(/[$,]/g, '');

      return aValue - bValue;
    }

    if (column === 3) {
      return a.cells[column].innerText - b.cells[column].innerText;
    }

    const aText = a.cells[column].innerText.toLowerCase();
    const bText = b.cells[column].innerText.toLowerCase();

    return aText.localeCompare(bText);
  });

  rows.forEach((row) => tbody.appendChild(row));
}

function makeLabel(newName) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (newName === 'Office') {
    const select = document.createElement('select');
    const offices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    offices.forEach((office) => {
      const option = document.createElement('option');

      option.textContent = office;
      select.appendChild(option);
    });

    label.textContent = `${newName}:`;
    label.append(select);
    select.setAttribute('name', 'name');
    select.setAttribute('data-qa', newName.toLowerCase());

    newForm.appendChild(label);
  } else if (newName === 'Salary' || newName === 'Age') {
    newForm.appendChild(label);
    label.textContent = `${newName}:`;
    label.append(input);
    input.setAttribute('name', 'name');
    input.setAttribute('type', 'number');
    input.setAttribute('data-qa', newName.toLowerCase());

    newForm.appendChild(label);
  } else {
    label.textContent = `${newName}:`;
    label.append(input);
    input.setAttribute('name', 'name');
    input.setAttribute('type', 'text');
    input.setAttribute('data-qa', newName.toLowerCase());

    newForm.appendChild(label);
  }
}

function createButton() {
  button.setAttribute('type', 'button');
  button.textContent = 'Save to table';

  newForm.appendChild(button);
}

const pushNotification = (
  posTop = 10,
  posRight = 10,
  title,
  description,
  type,
) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notificationTitle.classList.add('title');
  notificationTitle.textContent = title;
  notificationDescription.innerHTML = description.replace('\n', '</br>');
  notification.append(notificationTitle);
  notification.append(notificationDescription);
  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

makeLabel('Name');
makeLabel('Position');
makeLabel('Office');
makeLabel('Age');
makeLabel('Salary');
createButton();

button.addEventListener('click', () => {
  const DataName = document.querySelector('[data-qa="name"]').value;
  const DataPosition = document.querySelector('[data-qa="position"]').value;
  const DataOffice = document.querySelector('[data-qa="office"]').value;
  const DataAge = document.querySelector('[data-qa="age"]').value;
  const DataSalary = document.querySelector('[data-qa="salary"]').value;

  if (!DataName || !DataPosition || !DataOffice || !DataAge || !DataSalary) {
    pushNotification('Error', 'All fields are required', 'error');

    return;
  }

  if (DataName.length < 4) {
    pushNotification(
      'Error',
      'Name must be at least 4 characters long',
      'error',
    );
  }

  if (DataAge < 18 || DataAge > 90) {
    pushNotification('Error', 'Age must be between 18 and 90', 'error');
  }
});
