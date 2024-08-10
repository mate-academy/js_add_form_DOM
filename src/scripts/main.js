'use strict';

const heads = document.querySelectorAll('th');
const tBody = document.querySelector('table > tbody');
const body = document.querySelector('body');

let sortType = '';

const pushNotification = (posTop, posRight, title, description, type) => {
  const block = document.createElement('div');

  block.setAttribute('data-qa', 'notification');
  block.className = `notification ${type}`;
  block.style.display = 'relative';
  block.style.top = `${posTop}px`;
  block.style.right = `${posRight}px`;
  block.style.transition = 'all 300ms';

  block.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  body.append(block);

  setTimeout(() => {
    block.style.opacity = 0;
    setTimeout(() => (block.style.visibility = 'hidden'), 1000);
  }, 2000);
};

function sort(index, isReverse = false) {
  const rows = Array.from(tBody.rows).sort((a, b) => {
    const sortResult = a.cells[index].textContent
      .trim()
      .localeCompare(b.cells[index].textContent.trim(), 'en', {
        numeric: true,
      });

    return isReverse ? -sortResult : sortResult;
  });

  tBody.append(...rows);
}

heads.forEach((head, index) => {
  head.addEventListener('click', () => {
    sort(index, sortType === head.textContent);

    if (sortType === head.textContent) {
      sortType = '';
    } else {
      sortType = head.textContent;
    }
  });
});

const form = document.createElement('form');

form.className = 'new-employee-form';

function createFormInput(inputName, type, dataQa) {
  const input = document.createElement('input');

  input.id = inputName;
  input.name = inputName;
  input.type = type;
  input.setAttribute('data-qa', dataQa);

  const label = document.createElement('label');

  label.innerText = input.name[0].toUpperCase() + input.name.slice(1) + ':';
  label.appendChild(input);
  label.htmlFor = input.id;

  return label;
}

const nameLabel = createFormInput('name', 'text', 'name');
const positionLabel = createFormInput('position', 'text', 'position');
const ageLabel = createFormInput('age', 'number', 'age');
const salaryLabel = createFormInput('salary', 'number', 'salary');

const office = document.createElement('select');
const officeLabel = document.createElement('label');

const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (let i = 0; i < 6; i++) {
  const option = document.createElement('option');

  option.value = options[i];
  option.text = options[i];

  office.appendChild(option);
}

office.setAttribute('data-qa', 'office');
officeLabel.innerText = 'Office:';
officeLabel.appendChild(office);

const button = document.createElement('button');

button.type = 'submit';
button.innerText = 'Save to table';

form.appendChild(nameLabel);
form.appendChild(positionLabel);
form.appendChild(officeLabel);
form.appendChild(ageLabel);
form.appendChild(salaryLabel);
form.appendChild(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = nameLabel.children.item(0);
  const positionInput = positionLabel.children.item(0);
  const salaryInput = salaryLabel.children.item(0);
  const ageInput = ageLabel.children.item(0);

  let isError = false;

  if (nameInput.value.trim().length < 4) {
    isError = true;

    pushNotification(
      10,
      10,
      'Name Error',
      "Name is invalid. \n It's should contain 4 and more characters",
      'error',
    );
  }

  if (!positionInput.value.trim()) {
    isError = true;

    pushNotification(
      150,
      10,
      'Position Error',
      'Position is invalid. \n Position can not be empty',
      'error',
    );
  }

  if (Number(ageInput.value) < 18 || Number(ageInput.value) > 90) {
    isError = true;

    pushNotification(
      290,
      10,
      'Age Error',
      'Age is invalid. \n Age must to be more than 18 and less than 90',
      'error',
    );
  }

  if (Number(salaryInput.value) <= 0) {
    isError = true;

    pushNotification(
      10,
      320,
      'Salary Error',
      'Salary is invalid. \n Salary must be more than 0',
      'error',
    );
  }

  if (!office.value) {
    isError = true;

    pushNotification(150, 320, 'Office error', 'Office is invalid.', 'error');
  }

  if (!isError) {
    const newRow = tBody.insertRow(tBody.rows.length);

    newRow.addEventListener('click', () => {
      Array.from(tBody.rows).forEach((i) => {
        i.className = '';
      });

      newRow.className += ' active';
    });

    const inputCell = newRow.insertCell();
    const positionCell = newRow.insertCell();
    const officeCell = newRow.insertCell();
    const ageCell = newRow.insertCell();
    const salaryCell = newRow.insertCell();

    inputCell.innerText = nameInput.value;
    positionCell.innerText = positionInput.value;
    officeCell.innerText = office.value;
    ageCell.innerText = ageInput.value.trim();

    salaryCell.innerText = Number(salaryInput.value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    });

    pushNotification(10, 10, 'Published', 'User was published.', 'success');
  }
});

Array.from(tBody.rows).forEach((row) => {
  row.addEventListener('click', () => {
    Array.from(tBody.rows).forEach((i) => {
      i.className = '';
    });

    row.className += ' active';
  });
});

body.appendChild(form);
