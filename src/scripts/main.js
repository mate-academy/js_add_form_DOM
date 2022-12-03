'use strict';

const cities = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];
let editTable = false;

const table = document.querySelector('table');

extractDataFromTable();

const form = createForm();

table.addEventListener('click', (e) => {
  if (e.target.nodeName === 'TH') {
    const sortVariant = e.target.textContent.toLowerCase();
    const sortDirection = switchSortDirection(e.target);
    const tableData = sortData(sortVariant, sortDirection);

    table.tBodies[0].remove();
    table.tHead.after(renderTable(tableData));
  }

  if (e.target.nodeName === 'TD' && e.target.closest('tr')) {
    selectRow(e.target.parentElement);
  }
});

table.addEventListener('dblclick', (e) => {
  const ceil = e.target;

  if (!editTable && ceil.nodeName === 'TD' && ceil.closest('tr')) {
    editTable = true;

    const currentValue = ceil.textContent;

    ceil.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');
    input.value = currentValue;

    input.addEventListener('blur', () => {
      changeData(input, currentValue);
    });

    input.addEventListener('keydown', function(eventObject) {
      if (eventObject.keyCode === 13) {
        changeData(input, currentValue);
      }
    });

    ceil.append(input);
    input.focus();
  }
});

form.addEventListener('click', (e) => {
  if (e.target.nodeName === 'BUTTON') {
    addUser(form);
  }
});

function changeData(input, currentValue) {
  const ceil = input.parentElement;

  if (input.value === '') {
    ceil.textContent = currentValue;
    delete ceil.firstElementChild;
    editTable = false;
  }

  const rowFirstCeil = ceil.parentElement.firstElementChild;

  let userName = rowFirstCeil.textContent;

  if (rowFirstCeil === ceil) {
    userName = currentValue;
  }

  const data = JSON.parse(localStorage.getItem('users'));
  const user = data.find(person => person.name === userName);

  for (const key in user) {
    if (user[key] === currentValue) {
      let newValue = input.value;

      if (key === 'age') {
        if (isNaN(newValue)) {
          newValue = currentValue;
        }

        if (Number(newValue) < 18 || Number(newValue) > 90) {
          newValue = currentValue;
        }
      }

      if (key === 'salary') {
        if (newValue[0] === '$') {
          newValue = Number(newValue.slice(1).replace(/,/gi, ''));
        }

        if (isNaN(newValue)) {
          newValue = currentValue;
        } else {
          newValue = prepareNumber(newValue);
        }
      }

      user[key] = newValue;

      localStorage.setItem('users', JSON.stringify(data));

      ceil.textContent = newValue;
      delete ceil.firstElementChild;
      editTable = false;
    }
  }
}

function pushNotification(options) {
  const [type, title, description] = options;

  const block = document.createElement('div');

  block.classList.add('notification');
  block.classList.add(type);
  block.dataset.qa = 'notification';

  const header = document.createElement('h2');

  header.classList.add('title');
  header.textContent = title;
  block.append(header);

  const text = document.createElement('p');

  text.textContent = description;
  block.append(text);

  document.body.append(block);

  window.setTimeout(function() {
    block.remove();
  }, 2000);
};

function createForm() {
  const formElement = document.createElement('form');

  formElement.classList.add('new-employee-form');
  formElement.method = 'post';
  formElement.action = '/';

  createFormElement(formElement, 'input', 'name');
  createFormElement(formElement, 'input', 'position');
  createFormElement(formElement, 'select', 'office');
  createFormElement(formElement, 'input', 'age');
  createFormElement(formElement, 'input', 'salary');
  createFormElement(formElement, 'button', 'Save to table');

  document.body.append(formElement);

  return formElement;
}

function createFormElement(formElement, type, text) {
  switch (type) {
    case 'input':
      const label = document.createElement('label');

      label.textContent = `${text[0].toUpperCase()}${text.slice(1)}:`;

      const input = document.createElement('input');
      let typeField = 'text';

      if (text === 'age' || text === 'salary') {
        typeField = 'number';
      }

      input.type = typeField;
      input.name = text;
      input.dataset.qa = text;
      input.required = true;
      label.append(input);

      formElement.append(label);
      break;

    case 'select':
      const labelSelect = document.createElement('label');

      labelSelect.textContent = `${text[0].toUpperCase()}${text.slice(1)}:`;

      const select = document.createElement('select');

      select.name = text;
      select.dataset.qa = text;
      select.required = true;

      cities.forEach(city => {
        const option = document.createElement('option');

        option.textContent = city;
        option.value = city;
        select.append(option);
      });

      labelSelect.append(select);

      formElement.append(labelSelect);
      break;

    case 'button':
      const button = document.createElement('button');

      button.type = 'button';
      button.textContent = text;

      formElement.append(button);
      break;
  }
}

function selectRow(currentTr) {
  const trBody = table.tBodies[0].rows;

  [...trBody].forEach(tr => {
    tr.classList.remove('active');
    currentTr.classList.add('active');
  });
}

function sortData(sortVariant, sortDirection) {
  const data = JSON.parse(localStorage.getItem('users'));

  data.sort((a, b) => {
    let strA = String(a[sortVariant]);
    let strB = String(b[sortVariant]);

    if (sortVariant === 'salary') {
      strA = Number(strA.slice(1).replace(/,/gi, '.'));
      strB = Number(strB.slice(1).replace(/,/gi, '.'));
    }

    switch (strA > strB) {
      case true:
        return (sortDirection === 'asc') ? 1 : -1;

      case false:
        return (sortDirection === 'asc') ? -1 : 1;

      default:
        return 0;
    }
  });

  return data;
}

function extractDataFromTable() {
  const trBody = table.tBodies[0].rows;
  const arr = [];

  [...trBody].forEach(tr => {
    arr.push({
      name: tr.children[0].textContent,
      position: tr.children[1].textContent,
      office: tr.children[2].textContent,
      age: tr.children[3].textContent,
      salary: tr.children[4].textContent,
    });
  });

  localStorage.setItem('users', JSON.stringify(arr));
}

function switchSortDirection(target) {
  const header = table.tHead;
  const currentDirection = target.dataset.sort;
  let newDirection = 'asc';

  if (currentDirection && currentDirection === 'asc') {
    newDirection = 'desc';
  }

  target.dataset.sort = newDirection;

  const headerCollection = header.firstElementChild.children;

  [...headerCollection].forEach(th => {
    if (th !== target) {
      if (th.dataset.sort) {
        th.removeAttribute('data-sort');
      }
    }
  });

  return newDirection;
}

function renderTable(arr) {
  const fragment = document.createDocumentFragment();
  const newTbody = document.createElement('tbody');

  arr.forEach(person => {
    const tr = document.createElement('tr');

    for (const item in person) {
      const td = document.createElement('td');

      td.textContent = person[item];
      tr.append(td);
    }

    newTbody.append(tr);
  });

  fragment.append(newTbody);

  return fragment;
}

function prepareNumber(numb) {
  const numberFormatter = Intl.NumberFormat('en-US');

  return `$${numberFormatter.format(Number(numb))}`;
}

function addUser(formElement) {
  const userName = formElement.name.value;
  const position = formElement.position.value;
  const office = formElement.office.value;
  const age = formElement.age.value;
  const salary = formElement.salary.value;
  const salaryCorrect = prepareNumber(salary);

  let options = [];

  if (userName.length < 4) {
    options = [
      'error',
      'Error',
      'The name must have more than 3 characters',
    ];
  }

  if (position === '') {
    options = [
      'error',
      'Error',
      'Position must be specified',
    ];
  }

  if (Number(age) < 18 || Number(age) > 90) {
    options = [
      'error',
      'Error',
      'Age must be between 18 and 90 years old',
    ];
  }

  if (Number(salary) <= 0) {
    options = [
      'error',
      'Error',
      'You need to set the salary',
    ];
  }

  if (options.length > 0) {
    pushNotification(options);
  } else {
    if (addData(userName, position, age, salaryCorrect, office)) {
      options = [
        'success',
        'Success',
        'Employee added to database',
      ];
    } else {
      options = [
        'error',
        'Error',
        'Error adding to database',
      ];
    }

    pushNotification(options);
  }
}

function addData(...args) {
  const [userName, position, age, salary, office] = args;

  const data = JSON.parse(localStorage.getItem('users'));

  data.push({
    name: userName,
    position: position,
    office: office,
    age: age,
    salary: salary,
  });

  localStorage.setItem('users', JSON.stringify(data));

  const tr = document.createElement('tr');

  for (const item in data[data.length - 1]) {
    const td = document.createElement('td');

    td.textContent = data[data.length - 1][item];
    tr.append(td);
  }

  table.tBodies[0].append(tr);

  return true;
}
