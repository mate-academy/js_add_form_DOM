'use strict';

const body = document.querySelector('body');
const table = body.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');
const tbodyRows = tbody.querySelectorAll('tr');
const rowsArray = Array.from(table.tBodies[0].rows);
const sortingOrder = Array(headers.length).fill(0);

// Implementation of table sorting
headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    if (header.classList.contains('ascending')) {
      header.classList.remove('ascending');
      header.classList.add('descending');
      sortingOrder[columnIndex] = 1;
    } else {
      header.classList.remove('descending');
      header.classList.add('ascending');
      sortingOrder[columnIndex] = 0;
    }

    rowsArray.sort((a, b) => {
      const aValue = a.cells[columnIndex].textContent.trim();
      const bValue = b.cells[columnIndex].textContent.trim();

      if (!sortingOrder[columnIndex]) {
        return aValue.localeCompare(bValue, undefined, { numeric: true });
      } else {
        return bValue.localeCompare(aValue, undefined, { numeric: true });
      }
    });

    rowsArray.forEach(row => table.tBodies[0].removeChild(row));
    rowsArray.forEach(row => table.tBodies[0].appendChild(row));

    headers.forEach((tHeader, index) => {
      if (index === columnIndex) {
        tHeader.classList.toggle('ascending', sortingOrder[columnIndex] === 0);
        tHeader.classList.toggle('descending', sortingOrder[columnIndex] === 1);
      } else {
        tHeader.classList.remove('ascending', 'descending');
      }
    });
  });
});

// Realization row select by user clicks
for (let i = 0; i < tbodyRows.length; i++) {
  tbodyRows[i].addEventListener('click', () => {
    const activeRow = document.querySelector('.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    tbodyRows[i].classList.add('active');
  });
}

// Creating form
const form = document.createElement('form');
const headersContent = [];
const officeColumnIndex = 2;
const options = [];
const formButton = document.createElement('button');

form.classList.add('new-employee-form');
formButton.textContent = 'Save to table';

for (let i = 1; i < table.rows.length - 1; i++) {
  const officeValue = table.rows[i].cells[officeColumnIndex].textContent;

  if (!options.includes(officeValue)) {
    options.push(officeValue);
  }
}

for (let i = 0; i < headers.length / 2; i++) {
  headersContent.push(headers[i].textContent);
}

for (let i = 0; i < headersContent.length; i++) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const fieldName = headersContent[i];

  label.textContent = headersContent[i] + ':';
  label.appendChild(input);
  form.appendChild(label);

  if (i === officeColumnIndex) {
    const select = document.createElement('select');

    select.required = true;
    select.setAttribute('data-qa', fieldName.toLowerCase());

    for (let j = 0; j < options.length; j++) {
      const option = document.createElement('option');

      option.value = options[j];
      option.textContent = options[j];
      select.appendChild(option);
    }

    label.removeChild(input);
    label.appendChild(select);
  }

  input.type = i === 3 || i === 4 ? 'number' : 'text';
  input.required = true;
  input.setAttribute('data-qa', fieldName.toLowerCase());

  form.appendChild(formButton);
  document.body.appendChild(form);
}

// Add form to table
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formInputs = form.querySelectorAll('input, select');
  const formValues = [];

  for (let i = 0; i < formInputs.length; i++) {
    formValues.push(formInputs[i].value);
  }

  const nameValue = formValues[0];
  const positionValue = formValues[1];
  const ageValue = parseInt(formValues[3]);
  const salaryInput = parseInt(formValues[4]);

  if (nameValue.trim().length < 4 && nameValue.includes(' ')) {
    showNotification(
      'error',
      'Invalid Name',
      'Name should have at least 4 letters and should not contain spaces.'
    );

    return;
  }

  if (positionValue.trim().length === 0) {
    showNotification(
      'error',
      'Invalid Position',
      'Position should not be empty and should not contain only spaces.'
    );

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    showNotification(
      'error',
      'Invalid Age',
      'Age should be between 18 and 90.'
    );

    return;
  }

  const newRow = document.createElement('tr');

  for (let i = 0; i < formValues.length; i++) {
    const newCell = document.createElement('td');
    let cellValue = formValues[i];

    if (i === 4) {
      cellValue = '$' + salaryInput.toLocaleString('en-US');
    }

    newCell.textContent = cellValue;
    newRow.appendChild(newCell);
  }

  tbody.appendChild(newRow);
  form.reset();
  rowsArray.push(newRow);

  showNotification('success', 'Success', 'New employee added successfully.');
});

// Add notification
function showNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('h2');

  notificationTitle.textContent = title;
  notification.appendChild(notificationTitle);

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;
  notification.appendChild(notificationDescription);

  body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Implement editing of table cells
tbody.addEventListener('dblclick', (e) => {
  const clickedElement = e.target.closest('td');
  let savedElementContent = '';

  if (clickedElement && clickedElement.tagName === 'TD') {
    savedElementContent = clickedElement.textContent;
    clickedElement.textContent = '';

    const input = document.createElement('input');

    input.classList.add('cell-input');
    clickedElement.appendChild(input);

    if (clickedElement.cellIndex === 2) {
      const select = document.createElement('select');

      select.classList.add('cell-select');

      for (let i = 0; i < options.length; i++) {
        const option = document.createElement('option');

        option.value = options[i];
        option.textContent = options[i];
        select.appendChild(option);
      }

      clickedElement.appendChild(select);
      select.focus();

      select.addEventListener('blur', () => {
        setTimeout(() => {
          updateCellContent(select, clickedElement, savedElementContent);
        });
      });

      select.addEventListener('keypress', (evt) => {
        if (evt.key === 'Enter') {
          setTimeout(() => {
            updateCellContent(select, clickedElement, savedElementContent);
          });
        }
      });
    } else {
      clickedElement.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => {
        setTimeout(() => {
          updateCellContent(input, clickedElement, savedElementContent);
        });
      });

      input.addEventListener('keypress', (evt) => {
        if (evt.key === 'Enter') {
          setTimeout(() => {
            updateCellContent(input, clickedElement, savedElementContent);
          });
        }
      });
    }
  }
});

function updateCellContent(input, cell, savedContent) {
  const columnIndex = cell.cellIndex;
  const enteredText = input.value.trim();

  if (columnIndex === 0 && enteredText.length < 4) {
    showNotification(
      'error',
      'Invalid Name',
      'Name should have at least 4 letters and should not contain spaces.'
    );
    cell.textContent = savedContent;
  } else if (columnIndex === 1 && enteredText.length === 0) {
    showNotification(
      'error',
      'Invalid Position',
      'Position should not be empty and should not contain only spaces.'
    );
    cell.textContent = savedContent;
  } else if (columnIndex === 3) {
    const age = parseInt(enteredText);

    if (isNaN(age) || age < 18 || age > 90) {
      showNotification(
        'error',
        'Invalid Age',
        'Age should be between 18 and 90 & should be a number'
      );
      cell.textContent = savedContent;
    } else {
      cell.textContent = age;
    }
  } else if (columnIndex === 4) {
    const salary = parseFloat(enteredText.replace('$', ''));

    if (isNaN(salary)) {
      showNotification(
        'error',
        'Invalid Value',
        'Value should by number'
      );
      cell.textContent = savedContent;
    } else {
      cell.textContent = '$' + salary.toLocaleString('en-US');
    }
  } else {
    cell.textContent = enteredText || savedContent;
  }
}
