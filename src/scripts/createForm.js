'use strict';
import { TAG_SELECT, employeeFields } from './utils';

const NEW_EMPLOYEE_FORM_CLASS = 'new-employee-form';
const SUBMIT_TYPE = 'submit';
const SUBMIT_BUTTON_TEXT = 'Save to table';

function createFormField(field) {
  const { nameValue, tag, type, required, options } = field;
  const label = document.createElement('label');
  const formField = document.createElement(tag);

  label.textContent = `${nameValue[0].toUpperCase()}${nameValue.slice(1)}: `;

  formField.name = nameValue;
  formField.required = required;
  formField.dataset.qa = nameValue;

  label.appendChild(formField);

  if (tag === TAG_SELECT) {
    options.forEach((option, index) => {
      const optionElement = document.createElement('option');

      if (index === 0) {
        optionElement.selected = true;
      }

      optionElement.value = option;
      optionElement.textContent = option;

      formField.append(optionElement);
    });
  } else {
    formField.type = type;
  }

  return label;
}

function createSubmitButton() {
  const submit = document.createElement('button');

  submit.type = SUBMIT_TYPE;
  submit.textContent = SUBMIT_BUTTON_TEXT;

  return submit;
}

export function createForm() {
  const form = document.createElement('form');

  form.className = NEW_EMPLOYEE_FORM_CLASS;

  for (const field of employeeFields) {
    const formField = createFormField(field);

    form.appendChild(formField);
  }

  const submit = createSubmitButton();

  form.appendChild(submit);

  document.body.insertBefore(form, document.querySelector('script'));

  return form;
}
