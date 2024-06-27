'use strict';
import {
  HEADER_AGE,
  HEADER_NAME,
  HEADER_OFFICE,
  HEADER_POSITION,
  HEADER_SALARY,
  ORDER_ASC,
  ORDER_DESC,
} from './utils';

let currentHeader = null;
let order = null;

function sortRows(rows, currentOrder, currentHeaderName, currentHeaderIndex) {
  return rows.sort((rowA, rowB) => {
    const cellValueA = rowA.children[currentHeaderIndex].textContent;
    const cellValueB = rowB.children[currentHeaderIndex].textContent;

    let result = 0;

    switch (currentHeaderName) {
      case HEADER_NAME:
      case HEADER_POSITION:
      case HEADER_OFFICE:
        result = cellValueA.localeCompare(cellValueB);
        break;

      case HEADER_AGE:
        result = +cellValueA - +cellValueB;
        break;

      case HEADER_SALARY:
        result =
          +cellValueA.replace(/[^0-9.-]+/g, '') -
          +cellValueB.replace(/[^0-9.-]+/g, '');
        break;

      default:
        result = 0;
        break;
    }

    if (currentOrder === ORDER_DESC) {
      result = -result;
    }

    return result;
  });
}

export function addTableSortEvent(table) {
  const tableHead = table.querySelector('thead');
  const tableBody = table.querySelector('tbody');

  tableHead.addEventListener('click', (e) => {
    const header = e.target.closest('th');

    if (!header) {
      return;
    }

    if (currentHeader !== header) {
      currentHeader = header;
      order = ORDER_ASC;
    } else {
      order = order === ORDER_ASC ? ORDER_DESC : ORDER_ASC;
    }

    const currentHeaderName = header.textContent.toLowerCase();
    const headers = tableHead.querySelectorAll('th');
    const currentHeaderIndex = Array.from(headers).findIndex(
      (child) => child.textContent.toLowerCase() === currentHeaderName,
    );

    const rows = Array.from(tableBody.querySelectorAll('tr'));

    sortRows(rows, order, currentHeaderName, currentHeaderIndex).forEach(
      (row) => {
        tableBody.append(row);
      },
    );
  });
}
