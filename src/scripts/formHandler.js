'use strict';

const { pushNotification } = require('./pushNotification.js');

let positionNotification = 10;
const errorTitle = `Validation error`;
const errorMessage = `Please check your data and try again.`;
const successTitle = `New employee added`;
const successMessage = `Congrats! Info about the new employee was added.`;

function formHandlerFunc(form, tbody) {
  const inputs = [
    form.querySelector('#name-input'),
    form.querySelector('#position-input'),
    form.querySelector('#office-input'),
    form.querySelector('#age-input'),
    form.querySelector('#salary-input'),
  ];

  if (inputs[0].value.length < 4
    || inputs[3].value < 18
    || inputs[3].value > 90
  ) {
    pushNotification(positionNotification, 10, errorTitle,
      errorMessage, 'error');

    positionNotification += 120;

    setTimeout(() => {
      positionNotification = 10;
    }, 2000);

    return;
  }

  const newRowForForm = document.createElement('tr');

  newRowForForm.innerHTML = inputs
    .reduce((prev, input) => (prev + `<td>${input.value}</td>`), '');

  tbody.appendChild(newRowForForm);

  inputs.forEach(input => (input.value = ''));

  pushNotification(positionNotification, 10, successTitle,
    successMessage, 'success');
}

module.exports = { formHandlerFunc };
