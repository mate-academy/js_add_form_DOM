export class TableSort {
  static #extractValue(columnIdx, value) {
    let extractedValue = value.cells[columnIdx].textContent;

    if (columnIdx === 3) {
      extractedValue = +extractedValue;
    }

    if (columnIdx === 4) {
      extractedValue = +extractedValue.replace(/[$,]/g, '');
    }

    return extractedValue;
  }

  static #resetSiblingsSortType(columnIdx, tHeadCells) {
    for (let i = 0; i < tHeadCells.length; i++) {
      if (columnIdx !== i) {
        tHeadCells[i].removeAttribute('data-sort');
      }
    }
  }

  static #setSortType(columnIdx, tHeadCells) {
    const currentSortType = tHeadCells[columnIdx].getAttribute('data-sort');
    let newSortType = null;

    TableSort.#resetSiblingsSortType(columnIdx, tHeadCells);

    if (!currentSortType || currentSortType === 'desc') {
      newSortType = 'asc';
    } else {
      newSortType = 'desc';
    }

    tHeadCells[columnIdx].setAttribute('data-sort', newSortType);

    return newSortType;
  }

  onTableSort(tHead, tBody, target) {
    const columnIdx = target.cellIndex;
    const tHeadCells = tHead.rows[0].cells;
    const tbodyRows = tBody.rows;

    const sortType = TableSort.#setSortType(columnIdx, tHeadCells);

    const sortedRows = [...tbodyRows].sort((a, b) => {
      const valueA = TableSort.#extractValue(columnIdx, a);
      const valueB = TableSort.#extractValue(columnIdx, b);

      if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB);
      }

      return valueA - valueB;
    });

    sortedRows.forEach((el) => {
      if (sortType === 'asc') {
        tBody.append(el);
      } else {
        tBody.prepend(el);
      }
    });
  }
}
