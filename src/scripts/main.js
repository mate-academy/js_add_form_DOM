'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const obj = {
  name: null,
  position: null,
  office: null,
  age: null,
  salary: null,
};

thead.addEventListener('click', (e) => {
  const rows = document.querySelectorAll('tr');

  const nameHeader = thead.children[0].children[0];
  const positionHeader = thead.children[0].children[1];
  const officeHeader = thead.children[0].children[2];
  const ageHeader = thead.children[0].children[3];
  const salaryHeader = thead.children[0].children[4];

  let node = null;
  const nameValue = 1;
  const positionValue = 3;
  const officeValue = 5;
  const ageValue = 7;
  const salaryValue = 9;

  const sortAscCallback = (a, b) => a.childNodes[node].textContent
    .localeCompare(b.childNodes[node].textContent);

  const sortDescCallback = (a, b) => b.childNodes[node]
    .textContent.localeCompare(a.childNodes[node].textContent);

  const sortSalaryAscCallback = (a, b) => a.childNodes[node].textContent
    .slice(1).split(',').join('')
        - b.childNodes[node].textContent
          .slice(1).split(',').join('');

  const sortSalaryDescCallback = (a, b) => b.childNodes[node].textContent
    .slice(1).split(',').join('')
        - a.childNodes[node].textContent
          .slice(1).split(',').join('');

  function sortColumn(sortCallback, sortSalaryCallback) {
    let callback = sortCallback;

    switch (e.target) {
      case nameHeader:
        node = nameValue;
        break;
      case positionHeader:
        node = positionValue;
        break;
      case officeHeader:
        node = officeValue;
        break;
      case ageHeader:
        node = ageValue;
        break;
      case salaryHeader:
        node = salaryValue;

        callback = sortSalaryCallback;
        break;
    }

    const result = [...rows].sort(callback);

    for (const tableRow in result) {
      if (result[tableRow].parentElement === tbody) {
        tbody.append(result[tableRow]);
      }
    }
  }

  switch (e.target) {
    case nameHeader:
      if (obj.name === 'ASC') {
        sortColumn(sortDescCallback, sortSalaryDescCallback);
        obj.name = 'DESC';
      } else if (obj.name === 'DESC' || obj.name === null) {
        sortColumn(sortAscCallback, sortSalaryAscCallback);
        obj.name = 'ASC';
      }
      break;
    case positionHeader:
      if (obj.position === 'ASC') {
        sortColumn(sortDescCallback, sortSalaryDescCallback);
        obj.position = 'DESC';
      } else if (obj.position === 'DESC' || obj.position === null) {
        sortColumn(sortAscCallback, sortSalaryAscCallback);
        obj.position = 'ASC';
      }
      break;
    case officeHeader:
      if (obj.office === 'ASC') {
        sortColumn(sortDescCallback, sortSalaryDescCallback);
        obj.office = 'DESC';
      } else if (obj.office === 'DESC' || obj.office === null) {
        sortColumn(sortAscCallback, sortSalaryAscCallback);
        obj.office = 'ASC';
      }
      break;
    case ageHeader:
      if (obj.age === 'ASC') {
        sortColumn(sortDescCallback, sortSalaryDescCallback);
        obj.age = 'DESC';
      } else if (obj.age === 'DESC' || obj.age === null) {
        sortColumn(sortAscCallback, sortSalaryAscCallback);
        obj.age = 'ASC';
      }
      break;
    case salaryHeader:
      if (obj.salary === 'ASC') {
        sortColumn(sortDescCallback, sortSalaryDescCallback);
        obj.salary = 'DESC';
      } else if (obj.salary === 'DESC' || obj.salary === null) {
        sortColumn(sortAscCallback, sortSalaryAscCallback);
        obj.salary = 'ASC';
      }
      break;
  }
});

tbody.addEventListener('click', (e) => {
  const tableRow = e.target.parentElement;
  const allTableRows = tbody.querySelectorAll('tr');

  for (const currentRow of allTableRows) {
    if (currentRow.className === 'active') {
      currentRow.classList.remove('active');
    }
  }

  tableRow.classList.toggle('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const body = document.querySelector('body');
const data = ['name', 'position', 'office', 'age', 'salary'];

for (const header of data) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (header === 'office') {
    const cities = ['Tokyo', 'Singapore', 'London', 'New York',
      'Edinburgh', 'San Francisco'];

    const select = document.createElement('select');

    select.name = header;
    select.dataset.qa = header;

    label.textContent = header[0].toUpperCase() + header.slice(1) + ':';

    for (const city of cities) {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;

      select.append(option);
    }
    select.setAttribute('required', '');

    label.append(select);
    form.append(label);
  } else {
    label.textContent = header[0].toUpperCase() + header.slice(1) + ':';
    input.name = header;
    input.type = 'text';

    if (header === 'age' || header === 'salary') {
      input.type = 'number';
    }

    input.dataset.qa = header;

    input.setAttribute('required', '');

    label.append(input);
    form.append(label);
  }
};

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);
body.append(form);

const titleError = 'Error!';
const titleSuccess = 'Success';
const descriptionError = 'The employee has not been added to the table.';
const descriptionSuccess = 'The employee has been successfully'
                            + ' added to the table.';

const pushNotification = (nameClass, title, description) => {
  const newElement = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  newElement.className = `notification ${nameClass}`;
  newElement.dataset.qa = 'notification';
  h2.className = `title`;
  h2.textContent = title;
  p.textContent = description;

  newElement.append(h2, p);
  body.append(newElement);

  setTimeout(() => {
    newElement.remove();
  }, 5000);
};

button.addEventListener('click', (e) => {
  const tr = document.createElement('tr');
  const labels = document.querySelectorAll('label');
  const values = [];

  for (const input of labels) {
    const inputValue = input.childNodes[1].value;

    if (String(inputValue) === '') {
      return;
    }

    values.push(inputValue);

    if (input.childNodes[1].name === 'name' && inputValue.length < 4) {
      pushNotification('error', titleError, descriptionError);
      values.pop();

      break;
    }

    if (input.childNodes[1].name === 'age') {
      if (Number(inputValue) < 18 || Number(inputValue) > 90) {
        pushNotification('error', titleError, descriptionError);
        values.pop();
      }
    }
  }

  if (values.length === labels.length) {
    for (const input of labels) {
      const inputValue = input.childNodes[1].value;
      const td = document.createElement('td');

      if (input.childNodes[1].name === 'salary') {
        td.textContent = `$${Number(inputValue).toLocaleString('en-US')}`;
      } else {
        td.textContent = inputValue;
      }

      if (input.childNodes[1].name === 'office') {
        input.childNodes[1].value = 'Tokyo';
      } else {
        input.childNodes[1].value = '';
      }

      tr.append(td);
    }

    tbody.append(tr);
    pushNotification('success', titleSuccess, descriptionSuccess);
  }

  e.preventDefault();
});

const cells = tbody.querySelectorAll('td');

for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener('dblclick', () => {
    const input = document.createElement('input');

    input.classList.add('.cell-input');

    input.value = cells[i].innerHTML;
    cells[i].innerHTML = '';
    cells[i].appendChild(input);
    input.focus();

    function updateValue(inputParam, startValueParam) {
      const newValue = inputParam.value;

      if (newValue === '') {
        cells[i].textContent = startValueParam;
      } else {
        cells[i].textContent = newValue;
      }
    }

    const startValue = input.value;

    input.addEventListener('blur', () => {
      updateValue(input, startValue);
    });

    input.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        updateValue(input, startValue);
      }
    });
  });
}
