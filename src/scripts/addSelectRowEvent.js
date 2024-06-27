'use strict';

const ACTIVE_CLASS = 'active';

let selectedRow = null;
let previousSelectedRow = null;

export function addSelectRowEvent(table) {
  const tableBody = table.querySelector('tbody');

  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row || row === selectedRow) {
      return;
    }

    if (previousSelectedRow) {
      previousSelectedRow.classList.remove(ACTIVE_CLASS);
    }

    selectedRow = row;
    selectedRow.className = ACTIVE_CLASS;

    previousSelectedRow = selectedRow;
  });
}
