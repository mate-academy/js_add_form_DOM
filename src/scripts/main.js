'use strict';

const thead = document.querySelector('thead');
const th = thead.querySelectorAll('th');
const tbody = document.querySelector('tbody');
const tr = tbody.rows;

const officeOptions = `
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
`;

const pushNotification = (title, description, type) => {
  const notification = document.querySelector('.notification');

  if (document.body.contains(notification)) {
    notification.remove();
  }

  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  document.body.append(div);
  div.append(h2);
  div.append(p);

  div.className = 'notification';
  div.setAttribute('data-qa', 'notification');
  div.classList.add(type);
  h2.className = 'title';
  h2.textContent = title;
  p.textContent = description;
};

// sorts table
thead.addEventListener('click', e => {
  let sort;
  const index = e.target.cellIndex;

  if (e.target.tagName !== 'TH') {
    return;
  }

  if (e.target.getAttribute('data-sorted') === 'ASC') {
    // sort in DESC order
    switch (e.target.textContent) {
      case 'Age':
        sort = function(coll, i) {
          return [...coll].sort((a, b) =>
            +b.children[i].textContent - +a.children[i].textContent);
        };
        break;

      case 'Salary':
        sort = function(coll, i) {
          return [...coll].sort((a, b) =>
            +b.children[i].textContent.slice(1).split(',').join('')
              - +a.children[i].textContent.slice(1).split(',').join('')
          );
        };
        break;

      default:
        sort = function(coll, i) {
          return [...coll].sort((a, b) =>
            b.children[i].textContent < a.children[i].textContent ? -1 : 1);
        };
    }

    for (let i = 0; i < th.length; i++) {
      th[i].removeAttribute('data-sorted');
    }

    e.target.setAttribute('data-sorted', 'DESC');
  } else {
    // sort in ASC order
    switch (e.target.textContent) {
      case 'Age':
        sort = function(coll, i) {
          return [...coll].sort((a, b) =>
            +a.children[i].textContent - +b.children[i].textContent);
        };
        break;

      case 'Salary':
        sort = function(coll, i) {
          return [...coll].sort((a, b) =>
            +a.children[i].textContent.slice(1).split(',').join('')
              - +b.children[i].textContent.slice(1).split(',').join('')
          );
        };
        break;

      default:
        sort = function(coll, i) {
          return [...coll].sort((a, b) =>
            a.children[i].textContent < b.children[i].textContent ? -1 : 1);
        };
    }

    for (let i = 0; i < th.length; i++) {
      th[i].removeAttribute('data-sorted');
    }

    e.target.setAttribute('data-sorted', 'ASC');
  }

  tbody.append(...sort(tr, index));
});

// selects row
tbody.addEventListener('click', e => {
  const selectedRow = e.target.closest('tr');

  for (let i = 0; i < tr.length; i++) {
    tr[i].classList.remove('active');
  }

  selectedRow.classList.add('active');
});

// form for adding employees
const form = document.createElement('form');

document.body.append(form);
form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
    <input
      id="name"
      data-qa="name"
      name="name"
      type="text"
      required
    >
  </label>

  <label>Position:
    <input
      id="position"
      data-qa="position"
      name="position"
      type="text"
      required
    >
  </label>

  <label>Office:
    <select
      id="office"
      data-qa="office"
      name="office"
      required
    >
      ${officeOptions}
    </select>
  </label>

  <label>Age:
    <input
      id="age"
      data-qa="age"
      name="age"
      type="number"
      required
    >
  </label>

  <label>Salary:
    <input
      id="salary"
      data-qa="salary"
      name="salary"
      type="number"
      required
    >
  </label>

  <button>Save to table</button>
`);

const nameInput = form.querySelector('#name');
const positionInput = form.querySelector('#position');
const officeInput = form.querySelector('#office');
const ageInput = form.querySelector('#age');
const salaryInput = form.querySelector('#salary');
const button = form.querySelector('button');
const inputsAll = form.querySelectorAll('input');

button.addEventListener('click', e => {
  e.preventDefault();

  for (let i = 0; i < inputsAll.length; i++) {
    if (!inputsAll[i].value) {
      pushNotification(
        'Erorr',
        'All fields should be signed with correct values',
        'error'
      );

      return;
    }
  }

  if (nameInput.value.length < 4) {
    pushNotification(
      'Erorr',
      'Name should be longer than 4 letters',
      'error'
    );

    return;
  }

  if (ageInput.value < 18 || ageInput.value > 90) {
    pushNotification(
      'Erorr',
      'Age should be more than 18 and less than 90',
      'error'
    );

    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${nameInput.value}</td>
      <td>${positionInput.value}</td>
      <td>${officeInput.value}</td>
      <td>${ageInput.value}</td>
      <td>$${Intl.NumberFormat('en-US').format(salaryInput.value)}</td>
    </tr>
  `);

  nameInput.value = null;
  positionInput.value = null;
  ageInput.value = null;
  salaryInput.value = null;

  pushNotification(
    'Success',
    'Employee has been added',
    'success'
  );
});

// cell edititing on double click
tbody.addEventListener('dblclick', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const inputs = tbody.querySelectorAll('.cell-input');

  if (inputs.length >= 1) {
    return;
  }

  const previousText = e.target.textContent;
  const newInput = e.target.cellIndex === 2
    ? document.createElement('select')
    : document.createElement('input');

  if (newInput.tagName === 'SELECT') {
    newInput.insertAdjacentHTML('afterbegin', officeOptions);
  }

  newInput.value = previousText;
  newInput.classList.add('cell-input');

  e.target.firstChild.replaceWith(newInput);

  const checkInput = function() {
    if (e.target.cellIndex === 0 || e.target.cellIndex === 1) {
      if (newInput.value.length < 4) {
        newInput.replaceWith(previousText);

        pushNotification(
          'Erorr',
          'Should be longer than 4 letters',
          'error'
        );

        return;
      }

      if (!isNaN(newInput.value)) {
        newInput.replaceWith(previousText);

        pushNotification(
          'Erorr',
          `Shouldn't be number`,
          'error'
        );

        return;
      }
    }

    if (e.target.cellIndex === 3) {
      if (isNaN(newInput.value)) {
        newInput.replaceWith(previousText);

        pushNotification(
          'Erorr',
          'Should be number',
          'error'
        );

        return;
      }

      if (newInput.value < 18 || newInput.value > 90) {
        newInput.replaceWith(previousText);

        pushNotification(
          'Erorr',
          'Age should be more than 18 and less than 90',
          'error'
        );

        return;
      }
    }

    if (e.target.cellIndex === 4) {
      if (isNaN(newInput.value)) {
        newInput.replaceWith(previousText);

        pushNotification(
          'Erorr',
          'Should be number',
          'error'
        );

        return;
      }

      newInput.replaceWith(
        `$${Intl.NumberFormat('en-US').format(newInput.value)}`
      );
    }

    newInput.replaceWith(newInput.value);
  };

  // eslint-disable-next-line no-shadow
  newInput.addEventListener('blur', e => {
    checkInput();
  }, true);

  // eslint-disable-next-line no-shadow
  newInput.addEventListener('keydown', e => {
    if (e.code === 'Enter') {
      checkInput();
    }
  });
});
