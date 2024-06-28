const { utils } = require('./utils.js');
const { pushNotification } = require('./notification.js');
const { validateFormData } = require('./validateFormData.js');
const { SELECT_OPTIONS } = require('./constants.js');

const pageBody = document.querySelector('body');

function create({ headers, tbody }) {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  headers.forEach((header) => {
    const fieldName = header.toLowerCase();
    const label = document.createElement('label');
    let inputField = null;

    label.textContent = `${header}:`;

    if (fieldName === 'office') {
      inputField = document.createElement('select');

      SELECT_OPTIONS.forEach((item) => {
        const option = document.createElement('option');

        option.textContent = item;

        inputField.appendChild(option);
      });
    } else {
      inputField = document.createElement('input');
    }

    inputField.setAttribute('name', `${fieldName}`);
    inputField.setAttribute('data-qa', `${fieldName}`);

    if (fieldName === 'age' || fieldName === 'salary') {
      inputField.setAttribute('type', 'number');
    }

    label.appendChild(inputField);
    form.appendChild(label);
  });

  const formButton = document.createElement('button');

  formButton.textContent = 'Save to table';
  formButton.setAttribute('type', 'submit');

  form.appendChild(formButton);

  pageBody.appendChild(form);

  form.addEventListener('submit', (formEvent) => {
    formEvent.preventDefault();

    const prevNotification = document.querySelector('.notification');

    if (prevNotification) {
      prevNotification.remove();
    }

    const formData = new FormData(form);
    let isError = false;

    const newEmployee = document.createElement('tr');

    headers.forEach((header) => {
      if (isError) {
        return;
      }

      const fieldName = header.toLowerCase();
      let tdValue = formData.get(`${fieldName}`);

      if (!validateFormData.isValid(fieldName, tdValue)) {
        isError = true;

        switch (fieldName) {
          case 'name':
            pushNotification(
              10,
              10,
              'Error',
              'There was a problem with your submission.\n ' +
                'The name must have at least 4 letters.',
              'error',
            );
            break;

          case 'position':
            pushNotification(
              10,
              10,
              'Error',
              'There was a problem with your submission.\n ' +
                'The position cannot be an empty string.',
              'error',
            );
            break;

          case 'age':
            pushNotification(
              10,
              10,
              'Error',
              'There was a problem with your submission.\n ' +
                // eslint-disable-next-line max-len
                'It looks like you are either too young to work or should retire. Eligible age is 18 to 90 years old.',
              'error',
            );
            break;

          case 'salary':
            pushNotification(
              10,
              10,
              'Error',
              'There was a problem with your submission.\n ' +
                'The value should not be negative.',
              'error',
            );
            break;

          default:
            break;
        }

        return;
      }

      if (!isError) {
        if (fieldName === 'salary') {
          tdValue = utils.convertSalaryToString(tdValue);
        }

        const td = document.createElement('td');

        td.textContent = tdValue;

        newEmployee.appendChild(td);
      }
    });

    if (!isError) {
      tbody.appendChild(newEmployee);

      pushNotification(
        10,
        10,
        'success',
        'Great!\n ' + 'The employee was added to the table.',
        'success',
      );

      form.reset();
    }
  });
}

export const tableForm = {
  create,
};
