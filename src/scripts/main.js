'use strict';

import { setActiveRow } from './utils';
import { Form } from './form';
import { CellEdit } from './cell-edit';
import { TableSort } from './table-sort';

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

const { onTableSort } = new TableSort();
const { createForm: form } = new Form();
const { editCell } = new CellEdit();

tHead.addEventListener('click', (e) => onTableSort(tHead, tBody, e.target));

tBody.addEventListener('click', (e) => setActiveRow(e.target, tBody));

tBody.addEventListener('dblclick', (e) => editCell(e, tHead));

document.body.append(form());
