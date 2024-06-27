'use strict';

import { addEditingEvent } from './addEditingEvent';
import { addFormSubmitEvent } from './addFormSumbitEvent';
import { addSelectRowEvent } from './addSelectRowEvent';
import { addTableSortEvent } from './addTableSortEvent';
import { createForm } from './createForm';

const table = document.querySelector('table');

addTableSortEvent(table);
addSelectRowEvent(table);

const form = createForm();

addFormSubmitEvent(form);
addEditingEvent(table);
