'use strict';

// 1. Implement table sorting by clicking on the title (in two directions).
const table = document.querySelector('table');
const theads = document.querySelectorAll('th');
const tbody = document.querySelector('tbody');

let isAscendingOrder = true;

function parseCellValue(row, columnIndex) {
  const cellValue = row.cells[columnIndex].textContent.trim();

  return cellValue.startsWith('$') ? parseFloat(cellValue.slice(1)) : cellValue;
}

theads.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    const rows = [...tbody.rows];

    rows.sort((rowA, rowB) => {
      const valueA = parseCellValue(rowA, columnIndex);
      const valueB = parseCellValue(rowB, columnIndex);

      if (isNaN(valueA) || isNaN(valueB)) {
        return isAscendingOrder
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return isAscendingOrder ? valueA - valueB : valueB - valueA;
    });

    rows.forEach((row) => tbody.appendChild(row));

    isAscendingOrder = !isAscendingOrder;
  });
});

// 2. When user clicks on a row, it should become selected.
let activeRow = null;

tbody.querySelectorAll('tr').forEach((row) => {
  const handleRowClick = () => {
    const isActiveRowSelected = activeRow !== null;
    const isSameRowClicked = activeRow === row;

    if (isActiveRowSelected && !isSameRowClicked) {
      activeRow.classList.remove('active');
    }

    row.classList.add('active');
    activeRow = row;
  };

  row.addEventListener('click', handleRowClick);
});

// 3. Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.
const formHtml = `
  <form class="new-employee-form">
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
      />
    </label>
    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
      />
    </label>
    <label>
      Office:
      <select
        name="office"
        data-qa="office"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
      />
    </label>
    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
      />
    </label>
    <button
      type="button"
      id="save-button"
    >
      Save to table
    </button>
  </form>
  `;

table.insertAdjacentHTML('afterend', formHtml);

// 4. Show notification if form data is invalid
function createNotification(message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  const titleSpan = document.createElement('span');

  titleSpan.className = 'title';
  titleSpan.textContent = type.toUpperCase();

  const messageSpan = document.createElement('span');

  messageSpan.textContent = message;

  notification.appendChild(titleSpan);
  notification.appendChild(messageSpan);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

function validateFormData(formData) {
  if (formData.name.length < 4) {
    createNotification('Name must be at least 4 characters long.', 'error');

    return false;
  }

  if (formData.age < 18 || formData.age > 90) {
    createNotification('Age must be between 18 and 90.', 'error');

    return false;
  }

  if (!formData.position || !formData.office || !formData.salary) {
    createNotification('All fields are required.', 'error');

    return false;
  }

  return true;
}

const form = document.querySelector('.new-employee-form');
const saveButton = document.getElementById('save-button');

saveButton.addEventListener('click', () => {
  const formData = [...form.elements].reduce((acc, input) => {
    if (input.name) {
      acc[input.name] = input.value;
    }

    return acc;
  }, {});

  if (validateFormData(formData)) {
    const newRow = document.createElement('tr');
    const salaryFormatted = `$${parseInt(formData.salary).toLocaleString('en-US')}`;

    newRow.innerHTML = `
      <td>${formData.name}</td>
      <td>${formData.position}</td>
      <td>${formData.office}</td>
      <td>${formData.age}</td>
      <td>${salaryFormatted}</td>
    `;

    tbody.appendChild(newRow);
    createNotification('Employee added successfully!', 'success');

    form.reset();
  }
});

// 5. Implement editing of table cells by double-clicking on it. (optional)
const cells = tbody.querySelectorAll('td');

cells.forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const initialValue = cell.innerText;

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;

    cell.innerText = '';
    cell.appendChild(input);

    input.focus();

    const revertOrSave = () => {
      cell.innerText = input.value || initialValue;
    };

    input.addEventListener('blur', revertOrSave);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        revertOrSave();
      }
    });
  });
});
