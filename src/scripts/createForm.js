'use strict';

function formCreator() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  newForm.innerHTML = `
    <label>Name:
      <input
        id="name-input"
        name="name"
        type="text"
        data-qa="name"
      >
    </label>

    <label>Position:
      <input
        id="position-input"
        name="position"
        type="text"
        data-qa="position"
      >
    </label>

    <label>Office:
      <select name="office" id="office-input">
        <option value="tokyo">Tokyo</option>
        <option value="singapore">Singapore</option>
        <option value="london">London</option>
        <option value="edinburgh">Edinburgh</option>
        <option value="new-york">New York</option>
        <option value="san-francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input
        id="age-input"
        name="age"
        type="number"
        data-qa="age"
      >
    </label>

    <label>Salary:
      <input id="salary-input" name="salary" type="number" data-qa="salary">
    </label>

    <button type="submit" name="submit">Save to table</button>
  `;

  return newForm;
}

module.exports = { formCreator };
