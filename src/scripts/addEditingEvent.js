'use strict';

import { formatSalary } from './addNewEmployee';
import { showNotification } from './showNotification';
import {
  ERROR_TITLE,
  HEADER_AGE,
  HEADER_NAME,
  HEADER_OFFICE,
  HEADER_POSITION,
  HEADER_SALARY,
  OFFICE_OPTIONS,
  SUCCES_TITLE,
  TYPE_NUMBER,
} from './utils';
import { validateNumber, validateText } from './validation';

const CELL_INPUT_CLASS = 'cell-input';

function addCellFieldInput(cell, columnName, type = 'text') {
  const oldValue = cell.textContent;

  const input = document.createElement('input');
  const validation = type === 'text' ? validateText : validateNumber;

  if (columnName === HEADER_SALARY) {
    input.value = oldValue.replace(/[$,]/g, '');
  } else {
    input.value = oldValue;
  }

  input.name = columnName;
  input.classList.add(CELL_INPUT_CLASS);
  input.type = type;

  cell.textContent = '';
  cell.appendChild(input);

  input.focus();

  input.onblur = () => {
    if (input.value === '') {
      cell.textContent = oldValue;

      return;
    }

    const error = validation(input);

    if (error) {
      showNotification(ERROR_TITLE, error, false);
      input.focus();

      return;
    }

    if (columnName === HEADER_SALARY) {
      cell.textContent = formatSalary(input.value);
    } else {
      cell.textContent = input.value;
    }

    showNotification(SUCCES_TITLE, 'Cell updated', true);
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (input.value === '') {
        cell.textContent = oldValue;

        return;
      }

      const error = validation(input);

      if (error) {
        showNotification(ERROR_TITLE, error, false);
        cell.textContent = oldValue;
      } else {
        if (columnName === HEADER_SALARY) {
          cell.textContent = formatSalary(input.value);
        } else {
          cell.textContent = input.value;
        }
        showNotification(SUCCES_TITLE, 'Cell updated', true);
      }
    }
  });
}

function addCellFieldSelect(cell) {
  const select = document.createElement('select');
  const oldValue = cell.textContent;

  OFFICE_OPTIONS.forEach((option) => {
    const optionElement = document.createElement('option');

    optionElement.value = option;
    optionElement.textContent = option;

    if (oldValue === option) {
      optionElement.selected = true;
    }

    select.appendChild(optionElement);
  });

  cell.textContent = '';
  cell.appendChild(select);

  select.focus();

  select.onblur = () => {
    cell.textContent = select.value;
    showNotification(SUCCES_TITLE, 'Cell updated', true);
  };

  select.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      cell.textContent = select.value;
      showNotification(SUCCES_TITLE, 'Cell updated', true);
    }
  });
}

export function addEditingEvent(table) {
  const tableBody = table.querySelector('tbody');
  const tableHeadRow = table.querySelector('thead tr');

  tableBody.addEventListener('dblclick', (e) => {
    const tableCell = e.target.closest('td');

    if (!tableCell || tableCell.querySelector('input, select')) {
      return;
    }

    const currentCellIndex = [...tableCell.parentNode.children].findIndex(
      (cell) => cell === tableCell,
    );

    const currentColumnName =
      tableHeadRow.children[currentCellIndex].textContent.toLowerCase();

    switch (currentColumnName) {
      case HEADER_NAME:
      case HEADER_POSITION:
        addCellFieldInput(tableCell, currentColumnName);
        break;

      case HEADER_OFFICE:
        addCellFieldSelect(tableCell);
        break;

      case HEADER_AGE:
      case HEADER_SALARY:
        addCellFieldInput(tableCell, currentColumnName, TYPE_NUMBER);
        break;
    }
  });
}
