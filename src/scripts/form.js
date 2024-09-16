'use strict';

const buildForm = () => {
  const htmlMarkup = `<form class="new-employee-form">
  <label>Name: <input name="name" data-qa="name" type="text" /></label>
  <label
    >Position: <input name="position" data-qa="position" type="text"
  /></label>
  <label>
    Office:
    <select name="office" data-qa="office">
      <option disabled selected value="">Select an office</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>
    Age: <input name="age" data-qa="age" min=1  type="number" />
  </label>
  <label>
    Salary: <input name="salary" data-qa="salary" min=1000 type="number" />
  </label>
  <button type="submit">Save to table</button>
</form>`;

  document.body.insertAdjacentHTML('beforeend', htmlMarkup);
};

const createNotification = (divClass, message) => {
  const div = document.createElement('div');

  if (document.body.contains(document.querySelector(`.${divClass}`))) {
    return;
  }

  div.dataset.qa = 'notification';
  div.insertAdjacentHTML('beforeend', `<p class='title'>${message}</p>`);
  div.className = `notification ${divClass}`;

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
};

const validateFormInputs = (inputName, inputValue) => {
  if (!inputValue) {
    createNotification('error', 'Fill all the inputs');

    return false;
  }

  if (inputName === 'name' && inputValue.length < 4) {
    createNotification('error', 'Name is too short');

    return false;
  }

  if (inputName === 'age') {
    if (+inputValue < 18) {
      createNotification('error', 'You are too young');

      return false;
    }

    if (+inputValue > 90) {
      createNotification('error', 'You are too old');

      return false;
    }
  }

  return true;
};

module.exports = {
  buildForm,
  validateFormInputs,
  createNotification,
};
