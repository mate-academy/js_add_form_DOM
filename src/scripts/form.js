import { FormNotification } from './form-notification';
import { capitalizeFirstLetter, formatToCurrency } from './utils';

export class Form {
  static OFFICES = [
    `Tokyo`,
    `Singapore`,
    `London`,
    `New York`,
    `Edinburgh`,
    `San Francisco`,
  ];

  static #createSubmit() {
    const button = document.createElement('button');

    button.setAttribute('type', 'submit');
    button.textContent = 'Save to table';

    return button;
  }

  static #createInput(fieldName, option = {}) {
    const input = document.createElement('input');

    input.setAttribute('name', fieldName);
    input.setAttribute('data-qa', fieldName);
    input.setAttribute('required', true);

    Object.entries(option).forEach(([key, value]) => {
      input.setAttribute(key, value);
    });

    return input;
  }

  static #createLabel(fieldName, labelText, option) {
    const label = document.createElement('label');
    const input = Form.#createInput(fieldName, option);

    label.textContent = labelText;
    label.append(input);

    return label;
  }

  static #createOption(value) {
    const option = document.createElement('option');

    option.textContent = value;
    option.setAttribute('value', value);

    return option;
  }

  static #createSelect(fieldName) {
    const select = document.createElement('select');

    select.setAttribute('name', fieldName);
    select.setAttribute('data-qa', fieldName);

    Form.OFFICES.forEach((office) => {
      const option = Form.#createOption(office);

      select.append(option);
    });

    return select;
  }

  static #createSelectLabel(fieldName, labelText) {
    const selectLabel = document.createElement('label');
    const select = Form.#createSelect(fieldName);

    selectLabel.textContent = labelText;
    selectLabel.append(select);

    return selectLabel;
  }

  static #combineForm(form) {
    const nameField = this.#createLabel('name', 'Name:', { minlength: 4 });
    const positionField = this.#createLabel('position', 'Position:');
    const officeSelectField = this.#createSelectLabel('office', 'Office:');
    const ageField = this.#createLabel('age', 'Age:', {
      type: 'number',
      max: 90,
      min: 18,
    });
    const salaryField = this.#createLabel('salary', 'Salary:', {
      type: 'number',
    });
    const submit = this.#createSubmit();

    form.append(nameField);
    form.append(positionField);
    form.append(officeSelectField);
    form.append(ageField);
    form.append(salaryField);
    form.append(submit);

    return form;
  }

  static #validateForm(formData) {
    const notification = new FormNotification();

    for (const [key, value] of formData.entries()) {
      if (!value) {
        notification.showNotification({
          type: 'error',
          title: 'Error',
          message: `${capitalizeFirstLetter(key)} field is required`,
        });

        return false;
      }

      if (key === 'name' && value.length < 4) {
        notification.showNotification({
          type: 'error',
          title: 'Error',
          message: 'Name length should be at least 4 characters.',
        });

        return false;
      }

      if (key === 'age' && (value < 18 || value > 90)) {
        notification.showNotification({
          type: 'error',
          title: 'Error',
          message: 'Age should be at least 18 y.o. and less or equal than 90',
        });

        return false;
      }
    }

    return true;
  }

  static #onSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const isValide = Form.#validateForm(formData);

    if (!isValide) {
      return;
    }

    Form.#createNewRow(formData);
    e.target.reset();

    const notification = new FormNotification();

    notification.showNotification({
      type: 'success',
      title: 'Success',
      message: 'Employee has been added.',
    });
  }

  static #createNewRow(formData) {
    const tBody = document.querySelector('tbody');
    const newRow = document.createElement('tr');

    for (const [key, value] of formData.entries()) {
      let cellValue = value;
      const newCell = document.createElement('td');

      if (key === 'salary') {
        cellValue = formatToCurrency(value);
      }

      newCell.append(cellValue);
      newRow.append(newCell);
      tBody.append(newRow);
    }
  }

  createForm() {
    const form = document.createElement('form');

    form.classList.add('new-employee-form');
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', Form.#onSubmit);

    const combineForm = Form.#combineForm(form);

    return combineForm;
  }
}
