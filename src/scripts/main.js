/* eslint-disable function-paren-newline */
/* eslint-disable prettier/prettier */

'use strict';

// write code here

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const inputs = ['Name', 'Position', 'Age', 'Salary'];
const columnNames = ['Name', 'Position','Office', 'Age', 'Salary'];

const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add('new-employee-form');

function createInput(inputLabel, inputName, inputType = 'text') {
  const label = document.createElement('label');

  label.textContent = inputLabel;

  const input = document.createElement('input');

  input.name = inputName;

  if (inputLabel === 'Age' || inputLabel === 'Salary') {
    input.type = 'number';
  } else {
    input.type = inputType;
  }

  input.setAttribute('data-qa', inputName.toLowerCase());
  label.appendChild(input);

  return label;
}

inputs.forEach((item) => {

  const label = createInput(item, item.toLowerCase());

  newEmployeeForm.appendChild(label);
});

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office';

const select = document.createElement('select');

select.name = 'office';
select.setAttribute('data-qa', officeLabel.textContent.toLowerCase());

offices.forEach((item) => {
  const option = document.createElement('option');

  option.textContent = item;
  option.value = item;
  select.appendChild(option);
});
officeLabel.appendChild(select);

const positionField = newEmployeeForm.querySelector('[data-qa="position"]');

newEmployeeForm.insertBefore(officeLabel, positionField.parentNode.nextSibling);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';

newEmployeeForm.appendChild(button);
document.body.appendChild(newEmployeeForm);

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelectorAll('thead th');
  const table = document.querySelector('tbody');
  let tableRows = Array.from(table.querySelectorAll('tr'));
  const sortOrder = {};

  header.forEach((element, index) => {
    sortOrder[index] = true;

    element.addEventListener('click', () => {
      const headerName = element.textContent.trim();
      const columnNumber = Array.from(header).indexOf(element);

      function sortList(list) {
        let sortedList = [];

        switch (headerName) {
          case 'Name':
          case 'Position':
          case 'Office':
            sortedList = list.sort((a, b) =>
              sortOrder[columnNumber]
                ? a.cells[columnNumber].textContent
                  .trim()
                  .localeCompare(b.cells[columnNumber].textContent.trim())
                : b.cells[columnNumber].textContent
                  .trim()
                  .localeCompare(a.cells[columnNumber].textContent.trim()),
            );
            break;

          case 'Salary':
            sortedList = list.sort((a, b) =>
              sortOrder[columnNumber]
                ? parseFloat(
                  a.cells[columnNumber].textContent
                    .slice(1)
                    .split(',')
                    .join(''),
                ) -
                parseFloat(
                  b.cells[columnNumber].textContent
                    .slice(1)
                    .split(',')
                    .join(''),
                )
                : parseFloat(
                  b.cells[columnNumber].textContent
                    .slice(1)
                    .split(',')
                    .join(''),
                ) -
                parseFloat(
                  a.cells[columnNumber].textContent
                    .slice(1)
                    .split(',')
                    .join(''),
                ),
            );

            break;

          case 'Age':
            sortedList = list.sort((a, b) =>
              sortOrder[columnNumber]
                ? parseInt(a.cells[columnNumber].textContent) -
                parseInt(b.cells[columnNumber].textContent)
                : parseInt(b.cells[columnNumber].textContent) -
                parseInt(a.cells[columnNumber].textContent),
            );

            break;

          default:
            return;
        }

        table.innerHTML = '';
        sortedList.forEach((employee) => table.appendChild(employee));
      }

      sortList(tableRows);
      sortOrder[columnNumber] = !sortOrder[columnNumber];
    });
  },
  );

  tableRows.forEach((row) => {
    row.addEventListener('click', () => {
      tableRows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  table.addEventListener('dblclick', (e) => {
    e.preventDefault();

    const cellForEdit = e.target;
    const initialValue = e.target.textContent;
    const columnName = cellForEdit.dataset.columnName
      || columnNames[cellForEdit.cellIndex];

    let input;

    if (columnName === 'Office') {
      input = document.createElement('select');

      offices.forEach((office) => {
        const option = document.createElement('option');

        option.value = office;
        option.textContent = office;

        if (office === initialValue) {
          option.selected = true;
        }
        input.appendChild(option);
      });
    } else {
      input = document.createElement('input');
      input.value = initialValue;

      if (columnName === 'Age' || columnName === 'Salary') {
        input.type = 'number';
        input.min = 18;
        input.max = 90;
      } else {
        input.type = 'text';
      }

    }

    input.classList.add('cell-input');

    cellForEdit.textContent = '';
    cellForEdit.appendChild(input);
    input.focus();

    let isSaving = false;

    function save() {
      if (isSaving) {
        return;
      }
      isSaving = true;

      if (columnName === 'Age') {
        const age = parseInt(input.value);

        if (age >= 18 && age <= 90) {
          cellForEdit.textContent = age;
        } else {
          cellForEdit.textContent = initialValue;

          pushNotification(
            'Error message',
            'Age must be 18 - 90 years',
            'error',
          );
        }
      } else if (columnName === 'Name') {
        if (input.value.trim().length >= 4) {
          cellForEdit.textContent = input.value;
        } else {
          cellForEdit.textContent = initialValue;

          pushNotification(
            'Error message',
            'Name must have at least 4 letters',
            'error',
          );
        }
      } else if (columnName === 'Position') {
        if (input.value.trim().length > 0) {
          cellForEdit.textContent = input.value;
        } else {
          cellForEdit.textContent = initialValue;

          pushNotification(
            'Error message',
            'Position must be...',
            'error',
          );
        }
      } else if (columnName === 'Salary') {
        if (input.value.trim().length > 0) {
          cellForEdit.textContent = '$' + Number(input.value)
            .toLocaleString('en-US');
        } else {
          cellForEdit.textContent = initialValue;
        }
      } else {
        cellForEdit.textContent = input.value || initialValue;
      }
      input.remove();
    }

    input.addEventListener('blur', save);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        save();
      }
    });
  });

  newEmployeeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const newRow = document.createElement('tr');

    columnNames.forEach((columnName) => {
      const newCell = document.createElement('td');
      const inputValue = newEmployeeForm.querySelector(`[name='${columnName.toLowerCase()}']`);

      if (columnName === 'Office') {
        const officeInput = newEmployeeForm.querySelector(`select[name='office']`);

        newCell.textContent = officeInput.value;
        newRow.appendChild(newCell);
      }

      if (columnName === 'Name') {
        if (inputValue.value.trim().length >= 4) {
          newCell.textContent = inputValue.value;
          newRow.appendChild(newCell);
        } else {
          isValid = false;

          pushNotification(
            'Error message',
            'Name must have at least 4 letters',
            'error',
          );
        }
      } else if (columnName === 'Age') {
        const age = parseInt(inputValue.value);

        if (age <= 90 && age >= 18) {
          newCell.textContent = inputValue.value;
          newRow.appendChild(newCell);
        } else {
          isValid = false;

          pushNotification(
            'Error message',
            'Age must be 18 - 90 years',
            'error',
          );
        }
      } else if (columnName === 'Position') {
        if (inputValue.value.trim().length > 0) {
          newCell.textContent = inputValue.value;
          newRow.appendChild(newCell);
        } else {
          isValid = false;

          pushNotification(
            'Error message',
            'Position must be...',
            'error',
          );
        }
      } else if (columnName === 'Salary') {
        if (inputValue.value.trim().length > 0) {
          newCell.textContent = '$' + Number(inputValue.value)
            .toLocaleString('en-US');
          newRow.appendChild(newCell);
        } else {
          isValid = false;

          pushNotification(
            'Error message',
            'Salary must be...',
            'error',
          );
        }

      } else {
        newCell.textContent = inputValue.value;
        newRow.appendChild(newCell);
      }
    },
    );

    if (isValid) {
      table.appendChild(newRow);
      tableRows = Array.from(table.querySelectorAll('tr'));

      pushNotification(
        'Success message',
        'New employee successfully added',
        'success',
      );
      newEmployeeForm.reset();
    }
  });
});

const notifications = [];

function updateNotifications() {
  notifications.forEach((notification, index) => {
    notification.style.top = `${10 + index * 120}px`;
  });
}

const pushNotification = (title, description, type) => {
  const body = document.querySelector('body');
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notificationTitle.innerText = title;
  notificationTitle.classList.add('title');
  notification.setAttribute('data-qa', 'notification');

  notificationDescription.innerText = description;

  body.appendChild(notification);
  notifications.push(notification);
  updateNotifications();
  // setTimeout(() => (notification.style.visibility = 'hidden'), 2000);

  setTimeout(() => {
    notification.remove();
    notifications.shift();
    updateNotifications();
  }, 2000);

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationDescription);

  notification.classList.add('notification', type);
};

