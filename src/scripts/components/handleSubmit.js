/* eslint-disable no-shadow */
'use strict';

import dataValidation from './dataValidation';
import pushNotification from './notification';

const handleSubmit = (e) => {
  e.preventDefault();

  const inputs = [...e.target.elements];

  const values = [];

  for (let i = 0; i < inputs.length - 1; i += 1) {
    const item = inputs[i];
    const { name, value } = item;

    const validData = dataValidation(name, value);

    if (!validData) {
      pushNotification(
        10,
        10,
        'Invalid data',
        `Please make sure. \n
        Title has at least 4 characters and age from 18 to 90 years. And there are no empty fields`,
        'error',
      );

      return;
    }

    if (name === 'salary') {
      values.push(`$${Number(value).toLocaleString('en-US')}`);

      continue;
    }
    values.push(value);
  }

  const tableTag = document.querySelector('tbody');

  const rowTag = document.createElement('tr');

  values.forEach((value) => {
    const dataTag = document.createElement('td');

    dataTag.textContent = value;

    rowTag.append(dataTag);
  });

  tableTag.append(rowTag);

  inputs.forEach((input) => {
    input.value = '';
  });

  pushNotification(
    10,
    10,
    'Success',
    'Successfully added new employee',
    'success',
  );
};

export default handleSubmit;
