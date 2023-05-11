'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const thead = table.querySelector('thead');
const tableHeaders = thead.querySelectorAll('th');

let sortOrder = 1;
let activeHeader = null;
let currentCell = false;
let initialValue;
const offices = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

const form = document.createElement('form');
const saveBtn = document.createElement('button');

form.classList.add('new-employee-form');

tableHeaders.forEach(tableHeader => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = tableHeader.textContent;

  if (tableHeader.textContent === 'Office') {
    const select = createSelect(tableHeader);

    label.append(select);
    form.append(label);

    return;
  }

  if (tableHeader.textContent === 'Age'
    || tableHeader.textContent === 'Salary') {
    input.type = 'number';
  }
  input.type = 'text';

  input.name = tableHeader.textContent.toLowerCase();
  input.required = true;
  input.setAttribute('data-qa', tableHeader.textContent.toLowerCase());

  label.append(input);
  form.append(label);
});
saveBtn.textContent = 'Save to table';
form.append(saveBtn);
body.append(form);

function normaliseNumber(num) {
  return parseFloat(num.replace('$', '').replace(',', ''));
};

editTableCell(table);

thead.addEventListener('click', (e) => {
  const header = e.target.closest('TH');
  const index = header.cellIndex;
  const tableRows = [...tableBody.querySelectorAll('tr')];

  if (activeHeader !== header) {
    sortOrder = 1;
    activeHeader = header;
  } else {
    sortOrder = -sortOrder;
  }

  const sortedRows = tableRows.sort((a, b) => {
    let aValue = a.querySelectorAll('td')[index].innerText;
    let bValue = b.querySelectorAll('td')[index].innerText;

    if (index === 4) {
      aValue = normaliseNumber(aValue);
      bValue = normaliseNumber(bValue);
    }

    if (aValue < bValue) {
      return -sortOrder;
    } else if (aValue > bValue) {
      return sortOrder;
    } else {
      return 0;
    }
  });

  sortedRows.forEach(row => {
    tableBody.append(row);
  });
});

table.addEventListener('click', (e) => {
  const tableRows = [...tableBody.querySelectorAll('.active')];
  const tableRow = e.target.closest('TR');

  tableRows.forEach(row => row.classList.remove('active'));
  tableRow.classList.add('active');
});

function createSelect(value) {
  const select = document.createElement('select');

  offices.forEach(office => {
    const option = document.createElement('option');

    option.value = office;
    option.textContent = office;
    select.append(option);
  });

  select.setAttribute('data-qa', value.textContent.toLowerCase());
  select.required = true;
  select.name = value.textContent.toLowerCase();

  return select;
}

function notification(text, description, type) {
  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');
  message.classList.add('notification', type);

  message.innerHTML = `
    <h1>${text}</h1>
    <p>${description}</p>
  `;

  document.body.append(message);

  setTimeout(() => message.remove(), 4000);
};

function generateNotificationMessage(data) {
  if (data.name.trim().length < 4 || data.position.trim().length < 4) {
    notification(
      'Error',
      'Name and position should have at least 4 characters!',
      'error'
    );

    return false;
  };

  if (data.age < 18 || data.age > 90) {
    notification(
      'Error',
      'Age should be between 18 and 90 years!',
      'error'
    );

    return false;
  };

  if (data.salary <= 0) {
    notification(
      'Error',
      'Please enter valid salary amount!',
      'error'
    );

    return false;
  };

  if (!data.age || !data.salary) {
    notification(
      'Error',
      'Please fill all fields!',
      'error'
    );

    return false;
  };

  notification(
    'Sucess',
    'Data successfully added to the table!',
    'success'
  );

  return true;
};

saveBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  form.reset();

  if (!generateNotificationMessage(data)) {
    return;
  }

  addDataToTable(data);
});

function addDataToTable(data) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>$${Number(data.salary).toLocaleString('en-US')}</td>
  `;

  tableBody.appendChild(tr);
};

function editTableCell() {
  tableBody.addEventListener('dblclick', (e) => {
    const input = document.createElement('input');
    const editedCell = e.target.closest('TD');

    input.classList.add('cell-input');
    input.style.width = '100%';
    initialValue = e.target.textContent;
    e.target.textContent = '';
    currentCell = true;
    editedCell.textContent = '';
    editedCell.append(input);
    input.focus();

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        setCellValue(input, editedCell);
      };
    });

    input.addEventListener('blur', () => {
      setCellValue(input, editedCell);
    });
  });
};

function setCellValue(tableInput, cell) {
  if (!currentCell) {
    return;
  };

  let inputValue = tableInput.value.trim();
  const index = Array.from(cell.parentNode.children)
    .indexOf(cell);

  if (!inputValue) {
    inputValue = initialValue;
  }

  switch (true) {
    case index === 4:
      if (!checkInputValue(inputValue)) {
        notification(
          'Error',
          'Please enter a number',
          'error'
        );

        return;
      };

      cell.textContent = inputValue.slice(0, 1) === '$'
        ? `$${parseInt(inputValue
          .split(',').join('').slice(1)).toLocaleString('en-US')}`
        : `$${parseInt(inputValue
          .split(',').join('')).toLocaleString('en-US')}`;
      break;

    case index === 3:
      if (!checkInputValue(inputValue)
        || (inputValue > 90 || inputValue < 18)) {
        notification(
          'Error',
          'Please enter a valid age',
          'error'
        );

        return;
      };
      cell.textContent = inputValue;
      break;

    case index !== 4 || index !== 3:
      if (inputValue.length < 4) {
        notification(
          'Error',
          'Must be at least 4 characters',
          'error'
        );

        return;
      };
      cell.textContent = inputValue;
      break;
  }

  currentCell = false;
};

function checkInputValue(value) {
  return /^[0-9]+$/.test(value);
};
