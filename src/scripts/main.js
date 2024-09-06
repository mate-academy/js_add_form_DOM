'use strict';

// write code here
const table = document.getElementsByTagName('table')[0];
const tbody = table.tBodies[0];

sortingTable(table);
selectRow(tbody);
form();

function sortingTable(inputTable) {
  const thead = inputTable.tHead;
  const clickHandler = {
    holdedIndex: undefined,
    direction: true,
    changeDirection(columnIndex) {
      this.direction =
        this.holdedIndex !== columnIndex ? true : !this.direction;
    },
  };

  thead.addEventListener('click', (e) => {
    const cellIndex = e.target.cellIndex;
    const newList = sortedList(tbody.rows, cellIndex);

    tbody.innerHTML = '';
    createTbody(newList);
    clickHandler.holdedIndex = cellIndex;
  });

  function sortedList(tbodyRows, columnIndex) {
    const newList = [];

    clickHandler.changeDirection(columnIndex);

    for (let row = 0; row < tbodyRows.length; row++) {
      newList.push([]);

      for (let cell = 0; cell < tbodyRows[row].cells.length; cell++) {
        newList[row].push(tbodyRows[row].cells[cell].innerText);
      }
    }

    return newList.sort((a, b) => {
      const firstEl = clickHandler.direction ? a[columnIndex] : b[columnIndex];
      const secondEl = clickHandler.direction ? b[columnIndex] : a[columnIndex];

      if (columnIndex === 3 || columnIndex === 4) {
        return +firstEl.replace(/\D/g, '') - +secondEl.replace(/\D/g, '');
      } else {
        return firstEl.localeCompare(secondEl);
      }
    });
  }

  function createTbody(arr) {
    arr.forEach((row) => {
      const newRow = document.createElement('tr');

      row.forEach((cell) => {
        const newCell = document.createElement('td');

        newCell.innerText = cell;
        newRow.appendChild(newCell);
      });

      tbody.appendChild(newRow);
    });
  }
}

function selectRow(inputTable) {
  inputTable.addEventListener('click', (e) => {
    const selectedRow = e.target.parentElement.sectionRowIndex;

    for (let i = 0; i < tbody.rows.length; i++) {
      tbody.rows[i].removeAttribute('class');
    }
    tbody.rows[selectedRow].setAttribute('class', 'active');
  });
}

function form() {
  const formElem = document.createElement('form');
  const inputArr = ['Name', 'Position', 'Office', 'Age', 'Salary'];
  const dataOffice = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  formElem.name = 'table_input';

  inputArr.forEach((e) => {
    let input = document.createElement('input');
    const label = document.createElement('label');

    if (e === 'Office') {
      input = document.createElement('select');

      dataOffice.forEach((d) => {
        const opt = document.createElement('option');

        opt.value = d;
        opt.innerText = d;
        input.append(opt);
      });
    } else if (e === 'Age' || e === 'Salary') {
      input.type = 'number';
    } else {
      input.type = 'text';
    }

    input.setAttribute('data-qa', e.toLocaleLowerCase());
    label.innerText = `${e}: `;
    label.appendChild(input);
    formElem.append(label);
  });

  const inputSubmit = document.createElement('button');

  inputSubmit.innerText = 'Save to table';
  inputSubmit.type = 'submit';
  inputSubmit.setAttribute('for', 'table_input');
  formElem.appendChild(inputSubmit);

  formElem.setAttribute('class', 'new-employee-form');

  formElem.addEventListener('submit', (e) => {
    e.preventDefault();

    let error = false;
    const notifElem = document.createElement('div');
    const notifTitleElem = document.createElement('p');
    const newRow = document.createElement('tr');

    notifElem.setAttribute('data-qa', 'notification');
    notifTitleElem.setAttribute('class', 'title');
    notifTitleElem.innerText = 'Success';
    notifElem.setAttribute('class', 'notification success');

    for (let i = 0; i < e.target.length - 1; i++) {
      const key = e.target[i].dataset.qa;
      const value = e.target[i].value;
      const newTd = document.createElement('td');

      if (
        (key === 'name' && value.trim().length < 4) ||
        (key === 'age' && (value < 18 || value > 90)) ||
        value.trim().length === 0
      ) {
        notifTitleElem.innerText = 'Error';
        notifElem.setAttribute('class', 'notification error');
        notifElem.append(notifTitleElem);
        document.body.append(notifElem);
        error = true;
        break;
      }

      newTd.innerText = key === 'salary' ? toCurency(value) : value;
      newRow.append(newTd);
    }
    notifElem.append(notifTitleElem);
    document.body.append(notifElem);

    if (!error) {
      tbody.append(newRow);
    }
  });
  document.body.append(formElem);
}

function toCurency(num) {
  const USD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return USD.format(num).slice(0, -3);
}
