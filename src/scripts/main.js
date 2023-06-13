'use strict';

const headerRow = document.querySelector('table > thead > tr');
let colIndex = -1;
const tbody = document.querySelector('tbody');
const salaryToNumber = salary => +salary.slice(1).split(',').join('');

const sortTable = (cellIndex, isSorted) => {
  const sortedTable = [...tbody.children];

  sortedTable.sort((a, b) => {
    const contentA = a.cells[cellIndex].innerHTML;
    const contentB = b.cells[cellIndex].innerHTML;

    if (contentA.toUpperCase() !== contentA.toLowerCase()) {
      return contentA.localeCompare(contentB);
    }

    return contentA[0] !== '$' || contentB[0] !== '$'
      ? contentA - contentB
      : salaryToNumber(contentA) - salaryToNumber(contentB);
  });

  if (isSorted) {
    sortedTable.reverse();
  }

  tbody.append(...sortedTable);
};

headerRow.addEventListener('click', e => {
  const cellIndex = e.target.cellIndex;

  sortTable(cellIndex, colIndex === cellIndex);
  colIndex = (colIndex === cellIndex) ? -1 : cellIndex;
});

tbody.addEventListener('click', e => {
  const item = e.target.closest('tr');

  if (item) {
    return;
  }

  const current = document.querySelector('.active');

  if (current) {
    current.className = '';
  }
  item.className = 'active';
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const labelName = document.createElement('label');
const inputName = document.createElement('input');

labelName.textContent = 'Name: ';
inputName.name = 'name';
inputName.type = 'text';
inputName.dataset.qa = 'name';
form.append(labelName);
labelName.append(inputName);
inputName.required = true;

const labelPosition = document.createElement('label');
const inputPosition = document.createElement('input');

labelPosition.textContent = 'Position: ';
inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.dataset.qa = 'position';
form.append(labelPosition);
labelPosition.append(inputPosition);
inputPosition.required = true;

const labelSelect = document.createElement('label');
const selectOffice = document.createElement('select');

labelSelect.textContent = 'Office: ';
selectOffice.name = 'office';
selectOffice.dataset.qa = 'office';
form.append(labelSelect);
labelSelect.append(selectOffice);

const options = [
  {
    value: 'Tokyo', text: 'Tokyo',
  },
  {
    value: 'Singapore', text: 'Singapore',
  },
  {
    value: 'London', text: 'London',
  },
  {
    value: 'New York', text: 'New York',
  },
  {
    value: 'Edinburgh', text: 'Edinburgh',
  },
  {
    value: 'San Francisco', text: 'San Francisco',
  },
];

for (let i = 0; i < options.length; i++) {
  const option = document.createElement('option');

  option.value = options[i].value;
  option.textContent = options[i].text;
  selectOffice.appendChild(option);
}

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

labelAge.textContent = 'Age: ';
inputAge.name = 'age';
inputAge.type = 'number';
inputAge.dataset.qa = 'age';
form.append(labelAge);
labelAge.append(inputAge);
inputAge.required = true;

const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

labelSalary.textContent = 'Salary: ';
inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.dataset.qa = 'salary';
form.append(labelSalary);
labelSalary.append(inputSalary);

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.append(button);
document.body.append(form);

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');
  const header = document.createElement('h2');
  const content = document.createElement('p');

  message.dataset.qa = 'notification';
  message.className = `notification ${type}`;
  header.className = 'title';

  header.append(title);
  content.append(description);
  message.append(header);
  message.append(content);

  message.style.top = `${posTop}ppx`;
  message.style.right = `${posRight}px`;

  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
};

const errorName = [200, 10, 'Invalid name',
  'The name must consist of at least 4 characters.', 'error'];
const errorAge = [200, 10, 'Invalid age',
  'Age must be more than 18 and less than 90.', 'error'];
const success = [100, 10, 'The operation is successful',
  'Employee was successfully added', 'success'];
const errorSalary = [200, 10, 'Invalid salary',
  'Input correct salary.', 'error'];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  if (data.salary < 1) {
    pushNotification(...errorSalary);

    return;
  }

  const { name: cellName, position, office, age } = data;
  const salary = `$${parseInt(data.salary).toLocaleString('en-US')}`;

  if (cellName.length < 4) {
    pushNotification(...errorName);

    return;
  };

  if (age < 18 || age > 90) {
    pushNotification(...errorAge);

    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${cellName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${salary}</td>
     </tr>
  `);

  pushNotification(...success);

  form.reset();
});

tbody.addEventListener('dblclick', e => {
  const item = e.target.closest('td');
  const targetCell = item.cellIndex;
  const currentItem = item.textContent;

  if (!item.querySelector('input') && targetCell < 2) {
    const input = document.createElement('input');

    item.textContent = '';
    input.className = 'cell-input';
    input.value = item.textContent;
    input.type = 'text';

    item.appendChild(input);
    input.focus();

    input.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') {
        if (input.value.length < 4) {
          pushNotification(...errorName);

          updateCellInitial(item, currentItem, input);

          return;
        };

        updateCellCurrent(item, input);
      }
    });

    input.addEventListener('blur', ev => {
      if (!ev.target.value) {
        ev.target.value = currentItem;
      }

      if (input.value.length < 4) {
        pushNotification(...errorName);

        updateCellInitial(item, currentItem, input);

        return;
      };

      updateCellInitial(item, currentItem, input);
    });
  }

  if (!item.querySelector('input') && targetCell === 2) {
    const select = document.createElement('select');

    select.className = 'cell-input';

    select.insertAdjacentHTML('beforeend', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `);

    item.textContent = '';
    item.appendChild(select);
    select.focus();

    select.addEventListener('change', ev => {
      updateCellCurrent(item, select);
    });

    select.addEventListener('blur', ev => {
      updateCellInitial(item, currentItem, select);
    });

    select.addEventListener('keydown', ev => {
      if (ev.key === 'Enter') {
        updateCellCurrent(item, select);
      }
    });
  }

  if (!item.querySelector('input') && targetCell > 2) {
    const input = document.createElement('input');

    item.className = 'cell-input';
    item.textContent = '';
    input.value = item.textContent;
    input.type = 'number';

    item.appendChild(input);
    input.focus();

    const TARGET_CELL_AGE = 3;
    const TARGET_CELL_CURRENCY = 4;

    switch (targetCell) {
      case TARGET_CELL_AGE: {
        input.className = 'age';

        input.addEventListener('keydown', ev => {
          if (ev.key === 'Enter') {
            if ((input.value < 18 || input.value > 90)) {
              pushNotification(...errorAge);

              updateCellInitial(item, currentItem, input);

              return;
            };

            updateCellCurrent(item, input);
          }
        });

        input.addEventListener('blur', ev => {
          if (ev.target.value === '') {
            ev.target.value = currentItem;
          }

          if (input.value < 18 || input.value > 90) {
            pushNotification(...errorAge);

            updateCellInitial(item, currentItem, input);

            return;
          };

          updateCellCurrent(item, input);
        });

        break;
      }

      case TARGET_CELL_CURRENCY: {
        input.addEventListener('keydown', ev => {
          if (ev.key === 'Enter') {
            if (input.value.length === 0) {
              updateCellInitial(item, currentItem, input);

              return;
            };

            item.textContent = formatCurrency(input.value);
            input.remove();
          }
        });

        input.addEventListener('blur', ev => {
          if (!ev.target.value) {
            ev.target.value = currentItem;
          }

          if (input.value.length === 0) {
            updateCellInitial(item, currentItem, input);

            return;
          };

          item.textContent = formatCurrency(input.value);
          input.remove();
        });
      }
    }
    item.style.padding = '18px';
  }
});

function updateCellInitial(item, currentItem, input) {
  item.textContent = currentItem;
  input.remove();
}

function updateCellCurrent(item, input) {
  item.textContent = input.value;
  input.remove();
}

const formatCurrency = (value) => {
  return `$${parseInt(value).toLocaleString('en-US')}`;
};
