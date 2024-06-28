let isASC = true;
let currHeader = '';

function tSortingBy(header, headers, columnsType, tbodyRows, tbody) {
  const columnIndex = headers.indexOf(header);

  if (currHeader === header) {
    isASC = !isASC;
  } else {
    isASC = true;
    currHeader = header;
  }

  switch (columnsType[columnIndex]) {
    case 'money':
    case 'digits':
      tbodyRows.sort((a, b) => {
        let aValue = a.cells[columnIndex].textContent;
        let bValue = b.cells[columnIndex].textContent;

        if (columnsType[columnIndex] === 'money') {
          aValue = getNumFromMoney(aValue);
          bValue = getNumFromMoney(bValue);
        }

        return isASC ? aValue - bValue : bValue - aValue;
      });
      break;

    case 'words':
      tbodyRows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent;
        const bValue = b.cells[columnIndex].textContent;

        return isASC
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

      break;

    default:
      break;
  }

  tbodyRows.forEach((item) => {
    tbody.appendChild(item);
  });
}

function defineSortValue(item) {
  if (item[0] === '$' && item.split(/\s/).length === 1) {
    return 'money';
  }

  if (typeof Number(item) === 'number' && !isNaN(Number(item))) {
    return 'digits';
  }

  return 'words';
}

function getNumFromMoney(v) {
  return v.replace(',', '').slice(1);
}

export const tableSorting = {
  tSortingBy,
  defineSortValue,
};
