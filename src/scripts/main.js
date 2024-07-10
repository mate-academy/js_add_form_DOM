'use strict';

import addForm from './components/addForm';
import addRow from './components/addRow';
import formValid from './handlers/formValid';
import sortTable from './handlers/sortTable';
import toggleActive from './handlers/toggleActive';
import handleInputs from './handlers/handleInputs';

const table = document.querySelector('table');
const body = document.querySelector('body');
const ths = [...table.tHead.firstElementChild.children];

document.addEventListener('DOMContentLoaded', () => {
  addForm(body, ths);

  table.addEventListener('click', (e) => {
    e.preventDefault();

    sortTable(e, table, ths);
    toggleActive(e, table);
  });

  table.tBodies[0].addEventListener('dblclick', (e) => {
    handleInputs(e, ths);
  });

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (formValid(form)) {
      addRow(form, table);
    }
  });
});
