'use strict';

function tableSort(type, tableItems) {
  let sortedTable;

  switch (type) {
    case 'Name':
      sortedTable = [...tableItems]
        .sort((a, b) => (
          a.children[0].innerText.localeCompare(b.children[0].innerText)
        ));
      break;

    case 'Position':
      sortedTable = [...tableItems]
        .sort((a, b) => (
          a.children[1].innerText.localeCompare(b.children[1].innerText)
        ));
      break;

    case 'Office':
      sortedTable = [...tableItems]
        .sort((a, b) => (
          a.children[2].innerText.localeCompare(b.children[2].innerText)
        ));
      break;

    case 'Age':
      sortedTable = [...tableItems]
        .sort((a, b) => (a.children[3].innerText - b.children[3].innerText));
      break;

    case 'Salary':
      sortedTable = [...tableItems]
        .sort((a, b) => (
          a.children[4].innerText.slice(1).split(',').join('')
          - b.children[4].innerText.slice(1).split(',').join('')
        ));
      break;

    default:
      sortedTable = [...tableItems];
      break;
  }

  return sortedTable;
}
module.exports = { tableSort };
