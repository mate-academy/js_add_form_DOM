'use strict';

const tableHeaders = [...document.querySelectorAll('thead th')];
let tableRows = [...document.querySelectorAll('tbody tr')];
const tbody = document.querySelector('tbody');
let orderSort = true;
let lastClickedHeader = null;
let indexRow = null;

const form = document.createElement('form');

form.classList.add('new-employee-form');

const createInput = (type, value, dataQa) => {
  const input = document.createElement('input');

  input.setAttribute('type', type);
  input.setAttribute('name', value);
  input.setAttribute('data-qa', dataQa);
  input.setAttribute('required', true);

  return input;
};

const createLabel = (text) => {
  const label = document.createElement('label');

  label.textContent = text;

  return label;
};

const createOption = (text, value) => {
  const option = document.createElement('option');

  option.textContent = text;
  option.setAttribute('value', value);

  return option;
};

const inputName = createInput('text', 'name', 'name');
const inputPosition = createInput('text', 'position', 'position');
const inputAge = createInput('number', 'age', 'age');
const inputSalary = createInput('number', 'salary', 'salary');

const button = document.createElement('button');

button.textContent = 'Save to table';

const labelName = createLabel('Name:');
const labelPosition = createLabel('Position:');
const labelCountry = createLabel('Country:');
const labelAge = createLabel('Age:');
const labelSalary = createLabel('Salary:');

const selectCountry = document.createElement('select');

form.setAttribute('id', 'formEmployees');
selectCountry.setAttribute('name', 'office');
selectCountry.setAttribute('data-qa', 'office');
button.setAttribute('type', 'submit');
button.setAttribute('form', 'formEmployees');

const countries = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

countries.forEach((c) => selectCountry.appendChild(createOption(c, c)));

labelName.appendChild(inputName);
labelPosition.appendChild(inputPosition);
labelCountry.appendChild(selectCountry);
labelAge.appendChild(inputAge);
labelSalary.appendChild(inputSalary);

form.append(
  labelName,
  labelPosition,
  labelCountry,
  labelAge,
  labelSalary,
  button,
);

document.body.appendChild(form);

tableRows.forEach((tr) => {
  tr.children[0].setAttribute('data-row', 'name');
  tr.children[1].setAttribute('data-row', 'position');
  tr.children[2].setAttribute('data-row', 'office');
  tr.children[3].setAttribute('data-row', 'age');
  tr.children[4].setAttribute('data-row', 'salary');
});

const showNotification = (message, type) => {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.alignItems = 'center';
  div.classList.add('notification', type);
  div.textContent = message;
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
};

const validateInput = (obj) => {
  if (obj.name.length < 4 || !obj.name.trim()) {
    showNotification('Name must be at least 4 letters', 'error');

    return false;
  }

  if (obj.position.length === 0 || !obj.position.trim()) {
    showNotification('Position is required', 'error');

    return false;
  }

  if (obj.age < 18 || obj.age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return false;
  }

  if (obj.salary.length === 0 || obj.salary < 0) {
    showNotification('Salary is required', 'error');

    return false;
  }

  return true;
};

const addComa = (value) => {
  const improvedValue = ('' + value).split('').reverse();
  let result = '';

  for (let i = 0; i < improvedValue.length; i++) {
    if (improvedValue.length >= 3) {
      if (i % 3 === 0) {
        result += ',';
      }
      result += improvedValue[i];
    } else {
      return value;
    }
  }

  result = result.split('').reverse().join('');

  if (result.endsWith(',')) {
    result = result.slice(0, -1);
  }

  return result;
};

button.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const formDataObj = Object.fromEntries(formData);

  if (validateInput(formDataObj)) {
    const tr = document.createElement('tr');

    for (const key in formDataObj) {
      const td = document.createElement('td');

      td.setAttribute('data-qa', key);
      td.setAttribute('data-row', key);

      const value = formDataObj[key];

      if (key === 'salary') {
        td.textContent = `$${addComa(value)}`;
      } else {
        td.textContent = value;
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
    showNotification('You added the new employee', 'success');
    editRow(tr);

    for (const input of form) {
      input.value = '';
    }
  }
  updateTableRows();
});

const updateTableRows = () => {
  tableRows = [...document.querySelectorAll('tbody tr')];

  tableRows.forEach((row, i) => {
    row.addEventListener('click', () => {
      const selectedRow = tableRows.find((r) => r.classList.contains('active'));

      if (indexRow !== i) {
        if (selectedRow) {
          selectedRow.classList.remove('active');
        }
        row.classList.add('active');
        indexRow = i;
      }
    });
  });
};

updateTableRows();

const validateField = (field, value) => {
  switch (field) {
    case 'name':
      if (value.length < 4 || !value.trim()) {
        showNotification('Name must be at least 4 letters', 'error');

        return false;
      }
      break;

    case 'position':
      if (value.length === 0 || !value.trim()) {
        showNotification('Position is required', 'error');

        return false;
      }
      break;

    case 'office':
      if (value.length === 0 || !value.trim()) {
        showNotification('Country is required', 'error');

        return false;
      }
      break;

    case 'age':
      if (
        value < 18 ||
        value > 90 ||
        !value.trim() ||
        value.toLowerCase() !== value.toUpperCase()
      ) {
        showNotification('Age must be between 18 and 90', 'error');

        return false;
      }
      break;
    case 'salary':
      if (
        value.length === 0 ||
        !value.trim() ||
        +value < 0 ||
        value.toLowerCase() !== value.toUpperCase()
      ) {
        showNotification('Salary is required', 'warning');

        return false;
      }
      break;
    default:
      return true;
  }

  return true;
};

const editRow = (row) => {
  row.addEventListener('dblclick', (e) => {
    const input = document.createElement('input');
    const target = e.target;
    const oldContent = e.target.textContent;

    const field = target.getAttribute('data-row');

    if (!field) {
      return;
    }

    input.classList.add('cell-input');
    target.textContent = '';
    target.appendChild(input);
    input.focus();

    const saveChanges = () => {
      const newValue = input.value.trim();

      if (validateField(field, newValue)) {
        if (field === 'salary') {
          target.textContent = `$${addComa(newValue)}`;
        } else {
          target.textContent = newValue === '' ? oldContent : newValue;
        }
      } else {
        target.textContent = oldContent;
      }
    };

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveChanges();
      }
    });
  });
};

tableRows.forEach((row) => {
  editRow(row);
});

function sortByText(rows, pos) {
  rows.sort((a, b) => {
    const textOne = a.children[pos].textContent;
    const textTwo = b.children[pos].textContent;

    return orderSort
      ? textOne.localeCompare(textTwo)
      : textTwo.localeCompare(textOne);
  });
}

function sortByNumber(rows, pos) {
  rows.sort((a, b) => {
    const numOne = a.children[pos].textContent
      .replace(',', '')
      .replace('$', '');
    const numTwo = b.children[pos].textContent
      .replace(',', '')
      .replace('$', '');

    return orderSort ? numOne - numTwo : numTwo - numOne;
  });
}

function updateTable(rows) {
  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}

tableHeaders.forEach((th, index) => {
  th.addEventListener('click', (e) => {
    const copyTableRows = [...tableRows];

    if (e.currentTarget !== lastClickedHeader) {
      orderSort = true;
    } else {
      orderSort = !orderSort;
    }
    lastClickedHeader = e.currentTarget;

    switch (e.currentTarget.textContent) {
      case 'Name':
      case 'Position':
      case 'Office':
        sortByText(copyTableRows, index);
        break;
      case 'Age':
      case 'Salary':
        sortByNumber(copyTableRows, index);
        break;
      default:
        return;
    }
    updateTable(copyTableRows);
  });
});
