'use strict';

// import
const { tableSort } = require('./sort.js');
const { formCreator } = require('./createForm.js');
const { formHandlerFunc } = require('./formHandler.js');

// to align table and form
document.body.firstElementChild.style.cssText = 'align-self: flex-start;';

// Vars
const tableHead = document.querySelector('thead > tr');
const tableBody = document.querySelector('tbody');
const form = formCreator();
let sortCounter = false;

// Add created form
document.body.appendChild(form);

// Form submit listener:
form.addEventListener('submit', (submitEve) => {
  submitEve.preventDefault();
  formHandlerFunc(form, tableBody);
});

// Double click on cell listener:
tableBody.addEventListener('dblclick', (dblClkEve) => {
  const rowItemDBL = dblClkEve.target.closest('td');
  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');
  newInput.value = rowItemDBL.innerText;
  rowItemDBL.innerHTML = '';

  rowItemDBL.appendChild(newInput);

  // Enter listener:
  newInput.addEventListener('keypress', (keyEve) => {
    if (keyEve.key === 'Enter') {
      newInput.dispatchEvent((new Event('blur', { isTrusted: true })));
    }
  });

  // Blur listener:
  newInput.addEventListener('blur', () => {
    rowItemDBL.innerHTML = newInput.value;
    newInput.value = '';
    newInput.remove();
  });
});

// Active row on the table listener:
tableBody.addEventListener('click', (e) => {
  const rowItem = e.target.closest('tr');

  for (const rowItemElement of tableBody.children) {
    rowItemElement.classList.remove('active');
  }

  rowItem.classList.add('active');
});

// Sort the table listener:
tableHead.addEventListener('click', (e) => {
  const headCell = e.target.closest('th');
  const tableRows = document.querySelectorAll('tbody > tr');
  const tableBodyToSort = document.querySelector('tbody');
  const sorted = tableSort(headCell.innerText, tableRows);

  if (sortCounter) {
    sorted.reverse();
  }

  tableBodyToSort.innerHTML = '';

  for (const item of sorted) {
    tableBodyToSort.appendChild(item);
  }

  if (!sortCounter) {
    sortCounter = true;
  } else {
    sortCounter = false;
  }
});
