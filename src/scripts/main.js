'use strict';

const tableEl = document.querySelector('table');
const tHead = tableEl.querySelector('thead');

tHead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return false;
  }

  const order = setOrder(e.target);

  sortTable(e.target, tableEl, order);
});

tableEl.tBodies[0].addEventListener('click', (e) => {
  if (e.target.parentElement.tagName !== 'TR') {
    return false;
  }

  setActiveRow(tableEl, e);
});

tableEl.tBodies[0].addEventListener('dblclick', (e) => {
  if (e.target.tagName !== 'TD') {
    return false;
  }

  editableCell(e.target);
});

function sortTable(element, table, order) {
  const index = [...element.parentElement.children].indexOf(element);

  const rows = [...table.querySelectorAll('tbody > tr')];

  rows.sort((a, b) => {
    if (getNumber(a.children[index].innerText)) {
      return order === 'ASC'
        ? getNumber(a.children[index].innerText)
          - getNumber(b.children[index].innerText)
        : getNumber(b.children[index].innerText)
          - getNumber(a.children[index].innerText);
    }

    if (a.children[index].innerText < b.children[index].innerText) {
      return order === 'ASC' ? -1 : 1;
    }

    if (a.children[index].innerText > b.children[index].innerText) {
      return order === 'ASC' ? 1 : -1;
    }

    return 0;
  });

  table.querySelector('tbody').append(...rows);
}

function getNumber(string) {
  return parseInt(string.replace(/\D/g, ''));
}

function setOrder(element) {
  if (!element.dataset.order) {
    element.dataset.order = 'ASC';
  } else {
    element.dataset.order === 'ASC'
      ? element.dataset.order = 'DESC'
      : element.dataset.order = 'ASC';
  }

  return element.dataset.order;
}

function setActiveRow(table, clickEvent) {
  const rows = [...table.querySelectorAll('tbody > tr')];
  const activeRow = rows.find((row) => row.classList.contains('active'));

  if (!activeRow) {
    clickEvent.target.parentElement.classList.add('active');
  } else {
    activeRow.classList.remove('active');
    clickEvent.target.parentElement.classList.add('active');
  }
}

function addForm() {
  document.body.insertAdjacentHTML('beforeend', `
    <form class="new-employee-form">
      <label>
        Name:
        <input
          name="name"
          data-qa="name"
          type="text"
          required
        >
      </label>
      <label>
      Position:
        <input
          name="position"
          data-qa="position"
          type="text"
          required
        >
      </label>
      <label>
        Office:
        <select
          name="office"
          data-qa="office"
          required
        >
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>
        Age:
        <input
          name="age"
          data-qa="age"
          type="number"
          required
        >
      </label>
      <label>
        Salary:
        <input
          name="salary"
          data-qa="salary"
          type="number"
          required
        >
      </label>
      <button
        id="submit-btn"
        type = "submit"
      >
        Save to table
      </button>
    </form>
  `);
}

addForm();

const salaryFormEl = document.querySelector('form input[name="salary"]');
const ageFormEl = document.querySelector('form input[name="age"]');

[salaryFormEl, ageFormEl].map((el) => {
  el.addEventListener('input', () => {
    el.value = el.value.replace(/\D/g, '');
  });

  el.addEventListener('paste', (e) => e.preventDefault);
});

const form = document.querySelector('form');
const submitBtn = document.querySelector('#submit-btn');

submitBtn.addEventListener('click', (e) => {
  addRow(form, tableEl, e);
});

function formatNumber(number) {
  let formattedNumber = Number(number).toLocaleString('en-US');

  formattedNumber = '$' + formattedNumber;

  return formattedNumber;
}

function addRow(formElement, tableElement, submitEvent) {
  const data = Object.fromEntries(new FormData(formElement).entries());

  if (!validateForm(data)) {
    submitEvent.preventDefault();

    return false;
  };

  tableElement.tBodies[0].insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.name}</td>
      <td>${data.position}</td>
      <td>${data.office}</td>
      <td>${data.age}</td>
      <td>${formatNumber(data.salary)}</td>
    </tr>
  `);
  submitEvent.preventDefault();
  form.reset();

  pushNotification(500, 10, 'Success!',
    'Good!\n '
    + 'Employee has been added!', 'success');
}

function validateForm(formData) {
  if (formData.name.length < 4 || formData.name.trim() === '') {
    pushNotification(500, 10, 'Error!',
      `Something went wrong!<br> `
      + `Name field cannot be empty! Or less then 4 letters!`, 'error');

    return false;
  }

  if (!formData.position || formData.position.trim() === '') {
    pushNotification(500, 10, 'Error!',
      `Something went wrong!<br> `
      + `Position field cannot be empty!`, 'error');

    return false;
  }

  if (+formData.age < 18 || +formData.age > 90) {
    pushNotification(500, 10, 'Error!',
      `Something went wrong!<br> `
      + `Age must be more 18 & less 90`, 'error');

    return false;
  }

  return true;
}

function pushNotification(posTop, posRight, title, description, type = '') {
  const notificationEl = document.createElement('div');

  notificationEl.className = `notification ${type}`;
  notificationEl.dataset.qa = 'notification';
  notificationEl.style.top = `${posTop}px`;
  notificationEl.style.right = `${posRight}px`;

  notificationEl.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(notificationEl);

  setTimeout(() => notificationEl.remove(), 4000);
};

function editableCell(cellElement) {
  let text = cellElement.textContent.trim();

  let isAmount = false;
  const isOfficeCell = isOffice(cellElement);
  const isNumberCell = isNumber(cellElement);

  if (text[0] === '$') {
    isAmount = true;
    text = parseInt(text.replace(/\D/g, ''));
  }

  cellElement.textContent = null;

  if (isOfficeCell) {
    cellElement.insertAdjacentHTML('beforeend', `
      <select id = "cell-select">
        <option
          value="Tokyo"
          ${text === 'Tokyo' ? 'selected' : ''}
        >
          Tokyo
        </option>
        <option
          value="Singapore"
          ${text === 'Singapore' ? 'selected' : ''}
        >
          Singapore
        </option>
        <option
          value="New York"
          ${text === 'New York' ? 'selected' : ''}
        >
          New York
        </option>
        <option
          value="Edinburgh"
          ${text === 'Edinburgh' ? 'selected' : ''}
        >
          Edinburgh
        </option>
        <option
          value="San Francisco"
          ${text === 'San Francisco' ? 'selected' : ''}
        >
          San Francisco
        </option>
      </select>
    `);
  } else {
    cellElement.insertAdjacentHTML('beforeend', `
      <input
        class = "cell-input"
        value = "${text}"
      >
    `);
  }

  const input = document.querySelector('.cell-input');
  const select = document.querySelector('#cell-select');

  if (input) {
    input.addEventListener('blur', () => {
      if (!input.value || input.value.trim() === '') {
        input.value = text;
      }

      if (validateCellInput(input, isAmount, isNumberCell)) {
        setCellValue(input, isAmount);
      } else {
        input.value = text;
        setCellValue(input, isAmount);
      }
    });

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        if (!input.value || input.value.trim() === '') {
          input.value = text;
        }

        if (validateCellInput(input, isAmount, isNumberCell)) {
          setCellValue(input, isAmount);
        } else {
          input.value = text;
          setCellValue(input, isAmount);
        }
      }

      if (isNumberCell) {
        input.addEventListener('input', () => {
          input.value = input.value.replace(/\D/g, '');
        });
      }
    });

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  if (select) {
    select.focus();

    select.addEventListener('blur', () => {
      setCellValue(select, isAmount);
    });
  }

  function setCellValue(inputElement, isAmountValue = false) {
    inputElement.parentElement.innerHTML = isAmount
      ? `$${Number(inputElement.value.trim()).toLocaleString('en-US')}`
      : inputElement.value.trim();
  }

  function isOffice(selectedCell) {
    if (selectedCell === selectedCell.parentElement.children[2]) {
      return true;
    }

    return false;
  }

  function isNumber(selectedCell) {
    if (selectedCell === selectedCell.parentElement.children[3]
      || selectedCell === selectedCell.parentElement.children[4]) {
      return true;
    }

    return false;
  }

  function validateCellInput(inputEl, isAmountVal, isNumberVal) {
    if (inputEl.value.length < 4 && !isNumberVal) {
      pushNotification(500, 10, 'Error!',
        'Bad!\n '
        + 'Value must be longer than 3 char', 'error');

      return false;
    }

    if (isNumberVal && !isAmountVal) {
      if (+inputEl.value < 18 || +inputEl.value > 90 || isNaN(+inputEl.value)) {
        pushNotification(500, 10, 'Error!',
          'Bad!\n '
          + 'Age must be more than 18 & less 90', 'error');

        return false;
      }
    }

    if ((isAmountVal && +inputEl.value === 0) || isNaN(+inputEl.value)) {
      pushNotification(500, 10, 'Error!',
        'Bad!\n '
        + 'Salary must be more than 0!', 'error');

      return false;
    }

    return true;
  }
}
