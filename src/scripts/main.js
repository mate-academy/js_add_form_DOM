'use strict';

let allRows = document.querySelector('tbody').querySelectorAll('tr');
const tableHeader = document.querySelector('thead');
let people = [];
let sortBy = '';
let isReverse = '';
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinbutgh',
  'San Francisco',
];

function headerEventAdder() {
  for (const head of tableHeader.children) {
    for (const info of head.children) {
      info.addEventListener('click', () => {
        if (sortBy !== info.textContent) {
          sortBy = info.textContent;
          isReverse = 1;
        } else {
          isReverse = isReverse * -1;
        }
        sort(sortBy);
      });
    }
  }
}

function rowActiveEventAdder() {
  for (const row of allRows) {
    row.addEventListener('click', () => {
      for (const rowReset of allRows) {
        rowReset.classList.remove('active');
      }
      row.classList.add('active');
    });
  }
}

function getPeople() {
  people = [];

  for (const row of allRows) {
    people.push({
      Name: row.children[0].textContent,
      Position: row.children[1].textContent,
      Office: row.children[2].textContent,
      Age: row.children[3].textContent,
      Salary: row.children[4].textContent,
      isActive: row.classList.contains('active'),
    });
  }
}

function sort(sortParam) {
  getPeople();

  people = people.sort((a, b) => {
    switch (sortParam) {
      case 'Name':
        return a.Name.localeCompare(b.Name) * isReverse;

      case 'Position':
        return a.Position.localeCompare(b.Position) * isReverse;

      case 'Office':
        return a.Office.localeCompare(b.Office) * isReverse;

      case 'Age':
        return (+a.Age - +b.Age) * isReverse;

      case 'Salary':
        return (
          (a.Salary.slice(1).split(',').join('') -
            b.Salary.slice(1).split(',').join('')) *
          isReverse
        );
    }
  });

  for (let i = 0; i < allRows.length; i++) {
    document.querySelector('table').deleteRow(1);
  }

  for (const person of people) {
    const newRow = document.createElement('tr');

    let newCell;

    for (const key of Object.keys(person)) {
      if (key === 'isActive') {
        continue;
      }
      newCell = document.createElement('td');
      newCell.textContent = person[key];
      newRow.appendChild(newCell);
    }

    if (person.isActive) {
      newRow.classList.add('active');
    }

    document.querySelector('tbody').appendChild(newRow);
  }

  allRows = document.querySelector('tbody').querySelectorAll('tr');

  for (const row of allRows) {
    row.addEventListener('click', () => {
      for (const rowReset of allRows) {
        rowReset.classList.remove('active');
      }
      row.classList.add('active');
    });
  }
}

function formCreate() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  for (const field of ['Name:', 'Position:', 'Office:', 'Age:', 'Salary:']) {
    const newLabel = document.createElement('label');
    let newInput;

    if (field !== 'Office:') {
      newInput = document.createElement('input');

      newInput.setAttribute('data-qa', field.toLowerCase().slice(0, -1));
      newInput.setAttribute('name', field.toLowerCase().slice(0, -1));
      newInput.setAttribute('type', 'text');
    } else {
      newInput = document.createElement('select');
      newInput.setAttribute('data-qa', field.toLowerCase().slice(0, -1));
      newInput.setAttribute('name', field.toLowerCase().slice(0, -1));

      for (const office of cities) {
        const newOption = document.createElement('option');

        newOption.setAttribute('value', office);
        newOption.textContent = office;
        newInput.appendChild(newOption);
      }
    }

    if (field === 'Salary:') {
      newInput.removeAttribute('type');
      newInput.setAttribute('type', 'number');
      newInput.setAttribute('step', 1000);
    }
    newInput.setAttribute('required', '');
    newLabel.textContent = field;
    newLabel.appendChild(newInput);
    newForm.appendChild(newLabel);
  }

  const newButton = document.createElement('button');

  newButton.setAttribute('type', 'button');

  newButton.textContent = 'Save to table';
  newButton.classList.add('button');

  newForm.appendChild(newButton);
  document.querySelector('body').appendChild(newForm);

  document.querySelector('button').addEventListener('click', (e) => {
    e.preventDefault();

    const form = document.forms[0];
    const nameCell = document.createElement('td');
    const positionCell = document.createElement('td');
    const officeCell = document.createElement('td');
    const ageCell = document.createElement('td');
    const salaryCell = document.createElement('td');

    if (form.name.value.length < 4) {
      pushNotification(
        10,
        10,
        'Error!',
        'Name must be at least 4 letters long!',
        'error',
      );
    } else if (form.position.value === '') {
      pushNotification(10, 10, 'Error!', `Position can't be empty!`, 'error');
    } else if (
      form.age.value < 18 ||
      form.age.value > 90 ||
      isNaN(parseInt(form.age.value))
    ) {
      pushNotification(
        10,
        10,
        'Error!',
        'Age must be between 18 and 90!',
        'error',
      );
    } else {
      const newRow = document.createElement('tr');

      salaryCell.textContent = '$';
      nameCell.textContent = form.name.value;
      positionCell.textContent = form.position.value;
      officeCell.textContent = form.office.value;
      ageCell.textContent = +form.age.value;
      salaryCell.textContent += (+form.salary.value).toLocaleString('En-US');

      newRow.appendChild(nameCell);
      newRow.appendChild(positionCell);
      newRow.appendChild(officeCell);
      newRow.appendChild(ageCell);
      newRow.appendChild(salaryCell);

      document.querySelector('tbody').appendChild(newRow);

      allRows = document.querySelector('tbody').querySelectorAll('tr');

      for (const row of allRows) {
        row.addEventListener('click', () => {
          for (const rowReset of allRows) {
            rowReset.classList.remove('active');
          }
          row.classList.add('active');
        });
      }
      getPeople();

      pushNotification(
        10,
        10,
        'Succesfully added new row!',
        'New info added at the bottom of table.',
        'success',
      );
    }
  });
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');

  const header = document.createElement('h2');

  header.innerText = title;
  header.classList.add('title');

  const messageBody = document.createElement('p');

  messageBody.innerText = description;

  message.appendChild(header);
  message.appendChild(messageBody);
  message.classList.add('notification', type);
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, '2000');
};

headerEventAdder();
rowActiveEventAdder();
formCreate();
