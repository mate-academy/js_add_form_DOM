'use strict';

const styles = `
  label {
    text-transform: capitalize;
  }

  .notification {
    display: none;
    padding: 20px;
  }


  /* The Close Button */
  .close {
    color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`;

const styleSheet = document.createElement('style');

styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

document.body.appendChild(createForm());
document.body.appendChild(createModal());

const table = document.querySelector('table');
const form = document.forms[0];

form.addEventListener('submit', addNewEmployee);

table.addEventListener('click', (e) => {
  switch (e.target.tagName) {
    case 'TH':
      sortTable(table, e.target);
      break;

    case 'TD':
      highlightRow(table, e.target);
      break;
  }
});

table.addEventListener('dblclick', (e) => {
  switch (e.target.tagName) {
    case 'TD':
      editCell(e.target);
      break;
  }
});

function sortTable(tableNode, target) {
  const sortDirection = target.dataset.sort === 'ASC' ? 'DESC' : 'ASC';

  target.parentNode.querySelectorAll('th').forEach((element) => {
    delete element.dataset.sort;
  });

  target.dataset.sort = sortDirection;

  const columnIndex = target.cellIndex;
  const tableArray = Array.from(table.querySelector('tbody').rows);

  let sortedTableData;

  if ([3, 4].includes(columnIndex)) {
    sortedTableData = tableArray.sort((a, b) => {
      const valueA = integerCleaner(a.cells[columnIndex].innerHTML);
      const valueB = integerCleaner(b.cells[columnIndex].innerHTML);

      if (sortDirection === 'ASC') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  } else {
    sortedTableData = tableArray.sort((a, b) => {
      const nameA = a.cells[columnIndex].innerHTML.toUpperCase();
      const nameB = b.cells[columnIndex].innerHTML.toUpperCase();

      if (sortDirection === 'ASC') {
        if (nameA < nameB) {
          return -1;
        }

        if (nameA > nameB) {
          return 1;
        }
      } else {
        if (nameB < nameA) {
          return -1;
        }

        if (nameB > nameA) {
          return 1;
        }
      }
    });
  }

  const tbody = document.querySelector('table tbody');

  tbody.innerHTML = '';

  for (const rowData of sortedTableData) {
    const row = document.createElement('tr');

    for (let i = 0; i < table.rows[0].cells.length; i++) {
      const cell = document.createElement('td');

      cell.innerHTML = rowData.cells[i].innerHTML;
      row.append(cell);
    }
    tbody.append(row);
  }
}

function integerCleaner(value) {
  return value.replace(/[\s~`!@#$%^&*(){}[\];:"'<,.>?/\\|_+=-]/g, '');
}

function highlightRow(tableNode, target) {
  tableNode
    .querySelectorAll('tbody tr')
    .forEach((e) => e.classList.remove('active'));
  target.parentNode.classList.add('active');
}

function createForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  const fields = [
    { title: 'name', type: 'text' },
    { title: 'position', type: 'text' },
    {
      title: 'office',
      type: 'select',
      options: [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ],
    },
    { title: 'age', type: 'number' },
    { title: 'salary', type: 'number' },
  ];

  for (const field of fields) {
    const label = document.createElement('label');

    switch (field.type) {
      case 'text':
      case 'number':
        label.innerHTML = `${field.title}: <input name='${field.title}' type='${field.type}' data-qa='${field.title}'> `;
        break;

      case 'select':
        const select = document.createElement('select');

        select.name = field.title;
        select.required = true;
        select.dataset.qa = field.title;

        for (const option of field.options) {
          const opt = document.createElement('option');

          opt.value = option;
          opt.innerHTML = option;
          select.appendChild(opt);
        }

        label.prepend(`${field.title}:`, select);
    }

    newForm.appendChild(label);
  }

  const button = document.createElement('button');

  button.innerHTML = 'Save to table';

  newForm.appendChild(button);

  return newForm;
}

function addNewEmployee(e) {
  e.preventDefault();

  const errors = [];
  const tr = document.createElement('tr');

  const data = new FormData(form);

  for (const [key, value] of data) {
    const td = document.createElement('td');

    switch (key) {
      case 'name':
        td.innerHTML = value;

        if (value.trim().length < 4) {
          errors.push('Name should be at least 4 letters.');
        }
        break;

      case 'position':
        td.innerHTML = value;

        if (!value.trim()) {
          errors.push('Position is Empty');
        }
        break;

      case 'age':
        td.innerHTML = value;

        if (value < 18 || value > 90) {
          errors.push('Age should be between 18 and 90.');
        }
        break;

      case 'salary':
        td.innerHTML = convertToSalary(value);
        break;

      default:
        td.innerHTML = value;
    }
    tr.appendChild(td);
  }

  const notification = document.querySelector('.notification');

  const title = document.querySelector('.title');

  notification.classList.remove('error', 'success');

  title.innerHTML = '';

  if (errors.length === 0) {
    notification.classList.add('success');

    title.innerHTML = 'Employee has been added!';

    table.querySelector('tbody').appendChild(tr);
    form.reset();
  } else {
    notification.classList.add('error');

    let errorsHTML = '';

    for (const error of errors) {
      errorsHTML += `<p>${error}</p>`;
    }

    title.innerHTML = errorsHTML;
  }
  notification.appendChild(title);

  notification.style.display = 'block';
}

function createModal() {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';

  const closeNotification = document.createElement('span');

  closeNotification.classList.add('close');
  closeNotification.innerHTML = '&times;';

  closeNotification.addEventListener('click', (e) => {
    notification.style.display = 'none';
  });

  const title = document.createElement('div');

  title.classList.add('title');

  notification.appendChild(closeNotification);
  notification.appendChild(title);

  return notification;
}

function convertToSalary(number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

function editCell(target) {
  const initialValue = integerCleaner(target.innerHTML);
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;

  switch (target.cellIndex) {
    case 0:
    case 1:
      input.type = 'text';
      break;

    case 3:
    case 4:
      input.type = 'number';
      break;
  }

  target.innerHTML = '';
  target.appendChild(input);

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      updateCellValue(target, initialValue, input.value);
    }
  });

  input.addEventListener('blur', (e) => {
    updateCellValue(target, initialValue, input.value);
  });
}

function updateCellValue(target, initialValue, newValue) {
  const value = newValue || initialValue;

  if (target.cellIndex === 4) {
    target.innerHTML = convertToSalary(value);
  } else {
    target.innerHTML = value;
  }
}
