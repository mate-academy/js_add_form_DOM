'use strict';

const table = document.querySelector('table');
const tableBody = table.tBodies[0];
const rows = [...tableBody.rows];
const tHeadCells = document.querySelectorAll('thead th');

const form = document.createElement('form');
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

form.innerHTML = `
	<label>Name: <input name="name" type="text" minlength="4" pattern="\\S.{3,}" required data-qa="name"></label>

	<label>Position: <input name="position" type="text" pattern="\\S.{3,}" required data-qa="position"></label>

	<label>
	Office: 
	<select name="office" data-qa="office" required>
		${cities.map((city) => `<option value="${city}">${city}</option>`).join('')}
	</select>
	</label>

	<label>Age: <input name="age" type="number" min="18" max="90" required data-qa="age"></label>

	<label>Salary: <input name="salary" type="number" required data-qa="salary"></label>

	<button type="submit">Save to table</button>`;

form.classList.add('new-employee-form');
form.setAttribute('novalidate', 'novalidate');

const notification = document.createElement('div');

notification.classList.add('notification');
notification.setAttribute('data-qa', 'notification');

document.body.append(form);

const stringToDigit = (string) => {
  return +string.replace(/\D/g, '');
};

function addActiv() {
  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((el) => el.classList.remove('active'));
      row.classList.add('active');
    });
  });
}

function validationForm(e) {
  e.preventDefault();

  const invalidFields = [...form.querySelectorAll(':invalid')];

  [...form.elements].forEach((field) => {
    if (field.checkValidity()) {
      field.style.border = '';
      field.style.backgroundColor = '';
    }
  });

  if (form.checkValidity()) {
    notification.classList.remove('error');
    notification.classList.add('success');
    notification.innerText = 'The employee is added to the table';
    notification.style.display = '';
    document.body.prepend(notification);
    addEmployee();
  } else {
    notification.textContent = '';
  }

  invalidFields.forEach((field) => {
    if (!field.checkValidity()) {
      notification.classList.remove('success');
      notification.classList.add('error');
      notification.style.display = '';
      document.body.prepend(notification);

      field.style.border = '2px solid red';
      field.style.backgroundColor = '#ffe6e6';

      if (field.validity.patternMismatch) {
        notification.textContent = 'This field cannot be just spaces';
      } else if (field.validity.valueMissing) {
        notification.textContent = 'Fill in this field';
      } else if (field.validity.tooShort) {
        notification.textContent = `Text must be at least 4 characters long (you entered ${field.value.length} characters)`;
      } else if (field.validity.rangeUnderflow) {
        notification.textContent = 'Value must be greater than or equal to 18';
      } else if (field.validity.rangeOverflow) {
        notification.textContent = 'The value must be less than or equal to 90';
      }
    }
  });

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

function addEmployee() {
  const formData = new FormData(form);
  const formDataArr = [];

  formData.forEach((value, key) => {
    if (key === 'salary') {
      const dataValue = +value;
      const formatedValue = '$' + dataValue.toLocaleString('en-US');

      formDataArr.push(formatedValue);
    } else {
      formDataArr.push(value);
    }
  });

  const newRow = tableBody.insertRow();

  formDataArr.forEach((el) => {
    newRow.insertCell().textContent = el;
  });

  rows.push(newRow);

  addActiv();

  form.reset();
}

function editingCells() {
  const tableCells = [...tableBody.querySelectorAll('td')];

  tableCells.forEach((cell) => {
    cell.addEventListener('dblclick', (e) => {
      const activeInput = document.querySelector('.cell-input');

      if (activeInput) {
        const activeCell = activeInput.parentElement;

        activeCell.textContent =
          activeInput.value.trim() || activeInput.dataset.prevVal;
        activeInput.remove();
      }

      const prevContent = cell.textContent;

      cell.textContent = '';

      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.value = prevContent;
      input.setAttribute('data-prev-val', prevContent);
      cell.append(input);
      input.focus();

      //   cell.setAttribute('contenteditable', 'true');
      //   cell.focus();

      input.addEventListener('blur', () => {
        cell.textContent = input.value.trim() || prevContent;
        input.remove();

        // cell.removeAttribute('contenteditable');
      });

      input.addEventListener('keyup', (keyboard) => {
        if (keyboard.key === 'Enter') {
          input.blur();

          //   cell.blur();
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addActiv();

  let asc = true;
  let prevIndecs;

  tHeadCells.forEach((cell, i) => {
    cell.addEventListener('click', () => {
      if (prevIndecs !== i) {
        asc = true;
      }

      const sortBy = asc ? 1 : -1;

      const sortedRows = rows.sort((a, b) => {
        const contentsA = a.cells[i].textContent;
        const contentsB = b.cells[i].textContent;

        if (i === 4) {
          return (stringToDigit(contentsA) - stringToDigit(contentsB)) * sortBy;
        }

        return contentsA.localeCompare(contentsB) * sortBy;
      });

      prevIndecs = i;
      asc = !asc;

      tableBody.append(...sortedRows);
    });
  });

  form.addEventListener('submit', validationForm);

  editingCells();
});
