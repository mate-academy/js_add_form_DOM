'use strict';

const body = document.querySelector('body');
const sortBy = document.querySelector('tr');
const tBody = document.querySelector('tbody');
const rows = tBody.querySelectorAll('tr');
const minAge = 18;
const maxAge = 90;

body.insertAdjacentHTML('beforeend', `
<form class="new-employee-form">
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position:
  <input name="position" type="text" data-qa="position" required>
</label>
<label>Office:
  <select name="office" data-qa="office" required>
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York/option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select></label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary:
<input name="salary" type="number" data-qa="salary" required>
</label>
<button type="submit">Save to table</button>
</form>
`);

const pushNotification = (title, description, type) => {
  body.insertAdjacentHTML('beforeend', `
<div class="notification ${type}" data-qa="notification">
<h2 class="title">
  ${title}
</h2>

<p>
  ${description}
</p>
</div>
`);

  const notif = document.querySelectorAll('.notification');

  setTimeout(() => {
    notif.forEach(message => message.remove());
  }, 3000);
};

const form = document.querySelector('form');
const button = form.querySelector('button');
const inputName = form.querySelector('input[data-qa="name"]');
const inputAge = form.querySelector('input[data-qa="age"]');
const inputPosition = form.querySelector('input[data-qa="position"]');
const inputSalary = form.querySelector('input[data-qa="salary"]');
const inputOffice = form.querySelector('select[data-qa="office"]');

form.addEventListener('submit', (e) => {
  e.preventDefault(); e.target.reset();
});

button.addEventListener('click', e => {
  const nameLength = inputName.value.length;
  const age = inputAge.value;

  if (nameLength < 4 || age < minAge || age > maxAge) {
    pushNotification('Title of Error message',
      'Message example.\n '
      + 'Notification should contain title and description.', 'error');
  } else {
    pushNotification('Title of Success message',
      'Message example.\n '
      + 'Notification should contain title and description.', 'success');

    tBody.insertAdjacentHTML('beforeend', `
    <tr>
    <td>${inputName.value}</td>
    <td>${inputPosition.value}</td>
    <td>${inputOffice.value}</td>
    <td>${inputAge.value}</td>
    <td>$${inputSalary.value.slice(0, -3)},${inputSalary.value.slice(-3)}</td>
  </tr>
    `);
  }
});

function toNum(element) {
  return +element.innerText.slice(1).replaceAll(',', '');
}

function toNumAge(element) {
  return +element.innerText;
}

sortBy.addEventListener('click', e => {
  const columns = e.target.parentNode.children;

  [...columns].forEach((column, i) => {
    if (e.target.parentNode.children[i].innerText === e.target.innerText) {
      const parents = document.querySelector('tbody');
      const sort = parents.querySelectorAll('tr');
      let sorted;

      const sortForAge = (arr) => {
        return arr.sort((a, b) =>
          toNumAge(a.children[i]) - toNumAge(b.children[i]));
      };

      const sortForSalary = (arr) => {
        return arr.sort((a, b) =>
          toNum(a.children[i]) - toNum(b.children[i]));
      };

      const sortForString = (arr) => {
        return arr.sort((a, b) =>
          a.children[i].innerText.localeCompare(b.children[i].innerText));
      };

      switch (e.target.parentNode.children[i].innerText) {
        case 'Salary':
          sort[0] === sortForSalary([...sort])[0]
            ? sorted = sortForSalary([...sort]).reverse()
            : sorted = sortForSalary([...sort]);
          break;

        case 'Age':
          sort[0] === sortForAge([...sort])[0]
            ? sorted = sortForAge([...sort]).reverse()
            : sorted = sortForAge([...sort]);

          break;

        default:
          sort[0] === sortForString([...sort])[0]
            ? sorted = sortForString([...sort]).reverse()
            : sorted = sortForString([...sort]);
      }

      parents.append(...sorted);
    }
  });
});

rows.forEach(row => {
  addEventListener('click', e => {
    row.classList.remove('active');

    if (e.target.parentNode.innerText === row.innerText) {
      row.classList.add('active');
    }
  });
});

let isEditing = false;
let cell;
let previousTextContent = '';
const input = document.createElement('input');

tBody.addEventListener('dblclick', (e) => {
  if (!isEditing && e.target.tagName === 'TD') {
    isEditing = true;
    cell = e.target;
    previousTextContent = cell.textContent;
    input.classList = 'cell-input';
    input.value = previousTextContent;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
  }
});

tBody.addEventListener('keydown', (e) => {
  if (e.code !== 'Enter' || !isEditing) {
    return;
  }

  setEditedCellValue();
});

input.addEventListener('blur', (e) => {
  setEditedCellValue();
});

function setEditedCellValue() {
  if (isEditing) {
    const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
    const inputValue = input.value.trim();
    const inputWithDolar = `$${parseInt(inputValue.split(',').join('').slice(1)
    ).toLocaleString('en-US')}`;
    const inputWithoutDolar = `$${parseInt(inputValue.split(',').join('')
    ).toLocaleString('en-US')}`;

    switch (true) {
      case inputValue && cellIndex === 4:
        cell.textContent
          = inputValue.slice(0, 1) === '$'
            ? inputWithDolar
            : inputWithoutDolar;
        break;
      case inputValue && cellIndex !== 4:
        cell.textContent = inputValue;
        break;
      case !inputValue:
        cell.textContent = previousTextContent;
    }

    isEditing = false;
  }
}
