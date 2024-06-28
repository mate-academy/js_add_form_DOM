/* eslint-disable no-console */
'use strict';

const { tableSorting } = require('./tableSorting.js');
const { tableForm } = require('./tableForm.js');
const { validateFormData } = require('./validateFormData.js');
const { pushNotification } = require('./notification.js');
const { utils } = require('./utils.js');
const { SELECT_OPTIONS } = require('./constants.js');

const table = document.querySelector('table');

const headers = [];
const columnsType = [];

const thead = table.rows[0];
const tbody = table.children[1];
let tbodyRows = [...tbody.rows];

[...thead.cells].forEach((element) => {
  headers.push(element.textContent);

  element.addEventListener('click', () => {
    tbodyRows = [...tbody.rows];

    tableSorting.tSortingBy(
      element.textContent,
      headers,
      columnsType,
      tbodyRows,
      tbody,
    );
  });
});

[...tbodyRows[0].cells].forEach((element) => {
  columnsType.push(tableSorting.defineSortValue(element.textContent));
});

[...tbodyRows].forEach((element) => {
  element.addEventListener('click', () => {
    [...tbodyRows].forEach((elem) => {
      elem.classList.remove('active');
    });

    element.classList.add('active');
  });
});

tableForm.create({ headers, tbody });

// editing of table cells by double-clicking on it

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const cellValue = cell.innerText;
  let newCellValue = cellValue;
  const tr = cell.parentElement;
  const columnIndex = [...tr.cells].indexOf(cell);

  let input = document.createElement('input');

  if (columnsType[columnIndex] === 'digits') {
    input.setAttribute('type', 'number');
    input.setAttribute('min', '18');
    input.setAttribute('max', '90');
  }

  if (columnsType[columnIndex] === 'money') {
    input.setAttribute('type', 'number');
    input.setAttribute('min', '0');
    input.setAttribute('step', '100');

    newCellValue = Number(newCellValue.replace(',', '').slice(1));
  }

  if (headers[columnIndex] === 'Office') {
    input = document.createElement('select');

    SELECT_OPTIONS.forEach((item) => {
      const option = document.createElement('option');

      option.textContent = item;

      input.appendChild(option);
    });
  }

  input.classList.add('cell-input');
  input.value = newCellValue;

  cell.innerText = '';
  cell.append(input);

  input.focus();

  function saveChanges(saveEvent) {
    if (saveEvent.key === 'Escape') {
      if (columnsType[columnIndex] === 'money') {
        input.value = utils.convertSalaryToString(newCellValue);
        cell.innerText = utils.convertSalaryToString(newCellValue);

        return;
      }

      input.value = newCellValue;
      cell.innerText = newCellValue;

      return;
    }

    if (saveEvent.type === 'blur' || saveEvent.key === 'Enter') {
      if (columnsType[columnIndex] === 'money') {
        if (!validateFormData.isValid('salary', Number(input.value))) {
          pushNotification(
            10,
            10,
            'Error',
            'There was a problem with your submission.\n ' +
              'The value should not be negative.',
            'error',
          );
          input.value = utils.convertSalaryToString(newCellValue);
          cell.innerText = utils.convertSalaryToString(newCellValue);

          return;
        } else {
          cell.innerText = input.value
            ? utils.convertSalaryToString(input.value)
            : utils.convertSalaryToString(newCellValue);

          return;
        }
      }

      if (columnsType[columnIndex] === 'digits') {
        if (!validateFormData.isValid('age', Number(input.value))) {
          pushNotification(
            10,
            10,
            'Error',
            'There was a problem with your submission.\n ' +
              'Age should be between 18 and 90.',
            'error',
          );
          input.value = newCellValue;
          cell.innerText = newCellValue;

          return;
        } else {
          cell.innerText = input.value;

          return;
        }
      }

      newCellValue = input.value;

      cell.innerText = newCellValue;
    }
  }

  input.addEventListener('blur', saveChanges);
  input.addEventListener('keyup', saveChanges);
});
