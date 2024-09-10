'use strict';

function sortRows(rows, sortIndex, accending) {
  rows.sort((a, b) => {
    const aClean = a.cells[sortIndex].textContent
      ?.replace('$', '')
      .replace(',', '');
    const bClean = b.cells[sortIndex].textContent
      .replace('$', '')
      .replace(',', '');

    if (isNaN(aClean)) {
      if (accending) {
        return a.cells[sortIndex].textContent?.localeCompare(
          b.cells[sortIndex].textContent,
        );
      }

      return b.cells[sortIndex].textContent?.localeCompare(
        a.cells[sortIndex].textContent,
      );
    } else {
      if (accending) {
        return parseFloat(aClean) - parseFloat(bClean);
      }

      return parseFloat(bClean) - parseFloat(aClean);
    }
  });
}

function validator(data, formData = true) {
  if (formData || (!formData && data.get('name'))) {
    if (data.get('name').trim().length < 4) {
      pushNotification('Error', 'Name must have 4 or more characters', 'error');

      return false;
    }
  }

  if (formData || (!formData && data.get('position'))) {
    if (data.get('position').trim().length <= 0) {
      pushNotification('Error', 'Please enter position', 'error');

      return false;
    }
  }

  if (formData || (!formData && data.get('office'))) {
    if (!offices.includes(data.get('office'))) {
      pushNotification(
        'Error',
        `Invalid office locatioin please select from following: ${offices.join(', ')}`,
        'error',
      );

      return false;
    }
  }

  if (formData || (!formData && data.get('age'))) {
    if (
      isNaN(data.get('age')) ||
      +data.get('age') < 18 ||
      +data.get('age') > 90
    ) {
      pushNotification(
        'Error',
        'Age should be older then 18 and yonger then 99',
        'error',
      );

      return false;
    }
  }

  if (formData || (!formData && +data.get('salary'))) {
    if (isNaN(+data.get('salary')) || +data.get('salary') <= 0) {
      pushNotification('Error', 'Please enter valid salary', 'error');

      return false;
    }
  }

  return true;
}

function pushNotification(title, description, type = '') {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.dataset.qa = 'notification';
  message.style.top = `${500}px`;
  message.style.right = `${10}px`;

  message.innerHTML = `
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    `;
  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
const headerCells = tHead?.rows[0].cells;
const className = 'acdSorted';
const sortMapIndx = {};
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
  'London',
];
const formHTML = `<form
      id="form-new-empl"
      class="new-employee-form"
    >
      <label>Name:
        <input
          name="name"
          type="text"
          data-qa="name"
        >
      </label>

      <label>Position:
        <input
          name="position"
          type="text"
          data-qa="position"
        >
      </label>

      <label>Office:
        <select
          name="office"
          type="text"
          data-qa="office"
        >
          <option value="${offices[0]}">${offices[0]}</option>
          <option value="${offices[1]}">${offices[1]}</option>
          <option value="${offices[2]}">${offices[2]}</option>
          <option value="${offices[3]}">${offices[3]}</option>
          <option value="${offices[4]}">${offices[4]}</option>
          <option value="${offices[5]}">${offices[5]}</option>
          <option value="${offices[6]}">${offices[6]}</option>
        </select>
      </label>

      <label>Age:
        <input
          name="age"
          type="number"
          data-qa="age"
        >
      </label>

      <label>Salary:
        <input
          name="salary"
          type="number"
          data-qa="salary"
        >
      </label>

      <button type="submit">Save to table</button>
    </form>`;

document.querySelector('table').insertAdjacentHTML('afterend', formHTML);

const formElem = document.body.querySelector('#form-new-empl');

for (let i = 0; i < tHead?.rows[0].cells.length; i++) {
  sortMapIndx[headerCells[i].textContent] = i;
}

tHead?.addEventListener('click', (e) => {
  const acdStat = e.target.classList.contains(className);
  const tableRows = [...document.querySelector('tbody').rows];

  sortRows(tableRows, sortMapIndx[e.target.textContent], !acdStat);

  for (let i = 0; i < headerCells.length; i++) {
    const child = headerCells[i];

    child.classList.remove(className);
  }

  if (!acdStat) {
    e.target.classList.add(className);
  }

  for (let row = 0; row < tableRows.length; row++) {
    document.querySelector('tbody')?.append(tableRows[row]);
  }
});

tBody?.addEventListener('click', (e) => {
  for (let i = 0; i < document.querySelector('tbody').rows.length; i++) {
    document.querySelector('tbody').rows[i].classList.remove('active');
  }
  e.target.parentElement.classList.add('active');
});

formElem?.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(formElem);

  if (!validator(data)) {
    return;
  }

  const newTr = document.createElement('tr');
  for (const pair of data.entries()) {
    const newTd = document.createElement('td');

    if (pair[0] === 'salary') {
      newTd.textContent = parseInt(pair[1]).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    } else {
      newTd.textContent = pair[1];
    }

    newTr.append(newTd);
    tBody?.append(newTr);
    formElem.reset();
  }

  pushNotification('Success', 'Successfully added entry', 'success');
});

tBody?.addEventListener('dblclick', (e) => {
  function recInput(ev) {
    const actvInputCont = ev.target.value;
    const keyMap =
      tHead.rows[0].cells[
        [...activeCell.parentElement.cells].indexOf(activeCell)
      ].textContent?.toLocaleLowerCase();

    const tData = new FormData();

    tData.append(keyMap, actvInputCont);

    if (!actvInputCont) {
      activeCell.textContent = curentTxt;
      newInput.remove();

      return;
    }

    if (validator(tData, false)) {
      if (keyMap === 'salary') {
        activeCell.textContent = parseInt(actvInputCont).toLocaleString(
          'en-US',
          {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          },
        );
      } else {
        activeCell.textContent = actvInputCont;
      }

      newInput.remove();
    } else {
      newInput.focus();
    }
  }

  const activeCell = e.target;
  const curentTxt = activeCell.textContent;
  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');
  activeCell.textContent = '';
  activeCell.append(newInput);
  newInput.focus();

  newInput.addEventListener('focusout', recInput);

  newInput.addEventListener('keypress', (evnt) => {
    if (evnt.key === 'Enter') {
      recInput(evnt);
    }
  });
});
