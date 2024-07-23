'use strict';

const sortingParams = {
  column: null,
  rowsLength: null,
};

const onlyNumbers = (string) => +string.replace(/[$,]/g, '');

export const sortingHandler = () => {
  const tableHead = document.querySelector('thead');
  const tableBody = document.querySelector('tbody');

  tableHead.addEventListener('click', (e) => {
    const tableRows = [...tableBody.rows];
    const index = e.target.cellIndex;

    const { column, rowsLength } = sortingParams;

    if (column === index && rowsLength === tableRows.length) {
      tableRows.reverse();
    } else {
      sortingParams.column = index;
      sortingParams.rowsLength = tableRows.length;

      tableRows.sort((a, b) => {
        const el1 = a.children[index].innerText;
        const el2 = b.children[index].innerText;

        return isNaN(onlyNumbers(el1))
          ? el1.localeCompare(el2)
          : onlyNumbers(el1) - onlyNumbers(el2);
      });
    }

    tableBody.append(...tableRows);
  });
};
