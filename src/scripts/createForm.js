'use strict';

import { addNewRow } from './addNewRow.js';
import { createHTMLSelect } from './createSelect.js';
import { pushNotification } from './pushNotification.js';

const convertToString = (num) => '$' + num.toLocaleString('en-EN');

export function createForm() {
  const newForm = `
    <form class="new-employee-form">
      <label>Name:
        <input type="text" name="name" data-qa="name" />
      </label>

      <label>Position:
        <input type="text" name="position" data-qa="position" />
      </label>

      ${createHTMLSelect('office')}

      <label>Age:
        <input
          type="number"
          name="age"
          data-qa="age"
          min="18"
          max="90"
        />
      </label>

      <label>Salary:
        <input type="number" name="salary" min="1" data-qa="salary" />
      </label>

      <button>Save to table</button>
    </form>
  `;

  document.body.insertAdjacentHTML('beforeend', newForm);

  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = [...e.target.elements].slice(0, 5);
    const resArr = [];

    for (let i = 0; i < inputs.length; i++) {
      const inputName = inputs[i].name;
      const trimmedValue = inputs[i].value.trim();

      if (!trimmedValue) {
        pushNotification(
          10,
          10,
          'Validation failed!',
          'Empty fields not allowed!',
          'error',
        );

        return;
      }

      if (inputName === 'name' && trimmedValue.length < 4) {
        pushNotification(
          10,
          10,
          'Validation failed!',
          'Name must have more than 4 characters.',
          'error',
        );

        return;
      }

      if (inputName === 'age' && (+trimmedValue < 18 || +trimmedValue > 90)) {
        pushNotification(
          10,
          10,
          'Validation failed!',
          "Age value can't be less 18 or more than 90",
          'error',
        );

        return;
      }

      if (inputName === 'salary') {
        resArr.push(convertToString(+trimmedValue));

        continue;
      }

      resArr.push(trimmedValue);
    }

    addNewRow(resArr);

    pushNotification(
      10,
      10,
      'New employee added!',
      "You've just added a new employee to the table",
      'success',
    );

    form.reset();
  });
}
