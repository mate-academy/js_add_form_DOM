'use strict';

const body = document.querySelector('body');
const list = document.querySelector('tbody');
const head = document.querySelector('thead').firstElementChild;
let textContent;
let direction;

const options = `
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
`;

// -----function sorting item of list-----

function sortList(index) {
  const sortedList = [...list.children].sort((prev, cur) => {
    let a = prev.children[index].textContent.toLowerCase();
    let b = cur.children[index].textContent.toLowerCase();

    if (a.includes('$') || b.includes('$')) {
      a = +a.replace(/[$,]/g, '');
      b = +b.replace(/[$,]/g, '');
    }

    return a > b ? direction : a < b ? -direction : 0;
  });

  list.append(...sortedList);
}

// -----function added notification to html-----

function notification(type, title, description) {
  body.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `);

  setTimeout(() => {
    body.removeChild(document.querySelector('.notification'));
  }, 2000);
}

// -----function check is valid form data-----

function isValid(value, key) {
  if (!value) {
    notification('error', 'Error', 'You must complete every field');

    return false;
  }

  if (key === 'name' && value.length < 4) {
    notification('error', 'Error',
      'Name field must be at least 4 characters length');

    return false;
  }

  if (key === 'age' && (+value < 18 || +value > 90)) {
    notification('error', 'Error', 'Age must be between 18 and 90');

    return false;
  }

  return true;
}

// -----sorting list to click on head item-----

[...head.children].forEach((row, i) => {
  row.addEventListener('click', e => {
    if (textContent === e.target.textContent) {
      textContent = undefined;
      direction = -1;
    } else {
      direction = 1;
      textContent = e.target.textContent;
    }

    sortList(i);
  });
});

// -----focused item of list-----

document.addEventListener('click', e => {
  [...list.children].forEach(el => el.classList.remove('active'));

  const targetRow = e.target.closest('tr');

  if (targetRow && targetRow.closest('tbody')) {
    targetRow.classList.add('active');
  }
});

// -----html form-----

body.insertAdjacentHTML('beforeend', `
  <form
    class="new-employee-form"
    action="/"
    method="post"
  >
    <label>
      Name:

      <input
        name="name"
        type="text"
        data-qa="name"
      >
    </label>

    <label>
      Position:

      <input
        name="position"
        type="text"
        data-qa="position"
      >
    </label>

    <label>
      Office:

      <select name="office" data-qa="office">${options}</select>
    </label>

    <label>
      Age:

      <input
        name="age"
        type="number"
        data-qa="age"
        min="0"
      >
    </label>

    <label>
      Salary:

      <input
        name="salary"
        type="number"
        data-qa="salary"
        min="0"
      >
    </label>

    <button type="submit">Save to table</button>
  </form>
`);

// -----adding employee to form-----

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const tr = document.createElement('tr');

  for (const [key, value] of formData) {
    if (!isValid(value, key)) {
      return;
    }

    if (key === 'salary') {
      tr.insertAdjacentHTML('beforeend',
        `<td>$${(+value).toLocaleString()}</td>`);
    } else {
      tr.insertAdjacentHTML('beforeend', `<td>${value}</td>`);
    }
  }

  notification('success', 'Success', 'Employee has been added successfully!');
  list.append(tr);
  form.reset();
});

// -----editing of table cells by double-clicking on it-----

list.addEventListener('dblclick', e => {
  const element = e.target;
  const index = element.cellIndex;
  const innerText = element.innerText;
  const input = index === 2
    ? document.createElement('select')
    : document.createElement('input');

  element.innerText = '';
  input.value = innerText;
  input.classList.add('cell-input');

  switch (index) {
    case 2:
      input.insertAdjacentHTML('beforeend', `
        <option value="${innerText}">${innerText}</option>
        ${options}
      `);

      break;
    case 3:
      input.type = 'number';

      break;
    case 4:
      input.value = innerText.replace(/[$,]/g, '');
      input.type = 'number';

      break;
    default:
      input.type = 'text';
  }

  element.append(input);
  input.focus();

  input.addEventListener('keypress', eventKey => {
    if (eventKey.key === 'Enter') {
      input.blur();
    }
  });

  input.addEventListener('blur', eventBlur => {
    let isTrue;

    switch (index) {
      case 0:
        isTrue = isValid(input.value, 'name');

        break;
      case 3:
        isTrue = isValid(input.value, 'age');

        break;
      default:
        isTrue = true;
    }

    if (!isTrue) {
      element.innerText = innerText;
    } else {
      element.innerText = index === 4
        ? `$${(+input.value).toLocaleString()}`
        : input.value;
    }

    input.remove();
  });
});
