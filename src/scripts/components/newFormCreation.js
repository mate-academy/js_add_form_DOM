'use strict';

import createSelect from './creaeteSelect';
import handleSubmit from './handleSubmit';

const INPUTS_ARR = ['name', 'position', 'office', 'age', 'salary'];

const newFormCreation = () => {
  const formTag = document.createElement('form');

  INPUTS_ARR.forEach((input) => {
    const labelTag = document.createElement('label');
    const upperCaseName = `${input[0].toUpperCase()}${input.slice(1)}`;
    let inputTag;

    labelTag.textContent = `${upperCaseName}:`;

    if (input === 'office') {
      inputTag = createSelect();
    } else {
      inputTag = document.createElement('input');

      if (input === 'age' || input === 'salary') {
        inputTag.type = 'number';
      } else {
        inputTag.type = 'text';
      }
    }
    inputTag.name = input;
    inputTag.setAttribute('data-qa', `${input}`);
    labelTag.append(inputTag);

    formTag.append(labelTag);
  });

  const buttonTag = document.createElement('button');

  buttonTag.type = 'submit';
  buttonTag.textContent = 'Save to table';

  formTag.append(buttonTag);

  formTag.classList.add('new-employee-form');

  formTag.addEventListener('submit', handleSubmit);

  document.body.insertAdjacentElement('beforeend', formTag);
};

export default newFormCreation;
