'use strict';

import { employeeFields } from './utils';

export function formatSalary(salary) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(+salary);
}

function createRow(formElements) {
  const row = document.createElement('tr');

  for (const field of employeeFields) {
    const formFieldName = field.nameValue;

    const cell = document.createElement('td');

    if (formFieldName === 'salary') {
      cell.textContent = formatSalary(formElements[formFieldName].value);
    } else {
      cell.textContent = formElements[formFieldName].value;
    }

    row.appendChild(cell);
  }

  return row;
}

export function addNewEmployee(formElements) {
  const tableBody = document.querySelector('tbody');

  const row = createRow(formElements);

  tableBody.appendChild(row);
}
