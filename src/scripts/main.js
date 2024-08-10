'use strict';

const table = document.querySelector('table');
let sortDirection = true;
let activeRow = null;

const formHtml = `
<form class="new-employee-form">
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" min="18" max="90"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" min="0"></label>
  <button type="button" id="save-button">Save to table</button>
</form>
`;

const sortTable = (columnIndex) => {
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  rows.sort((rowA, rowB) => {
    let cellA = rowA.children[columnIndex].innerText;
    let cellB = rowB.children[columnIndex].innerText;

    if (columnIndex === 3) {
      cellA = parseInt(cellA, 10);
      cellB = parseInt(cellB, 10);
    } else if (columnIndex === 4) {
      cellA = parseFloat(cellA.replace(/[$,]/g, ''));
      cellB = parseFloat(cellB.replace(/[$,]/g, ''));
    }

    if (!isNaN(cellA) && !isNaN(cellB)) {
      return sortDirection ? cellA - cellB : cellB - cellA;
    }

    return sortDirection
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });

  rows.forEach((row) => table.querySelector('tbody').appendChild(row));
  sortDirection = !sortDirection;
};

table.querySelectorAll('th').forEach((header, index) => {
  header.addEventListener('click', () => {
    sortTable(index);
  });
});

table.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    if (activeRow) {
      activeRow.classList.remove('active');
    }
    row.classList.add('active');
    activeRow = row;
  });
});

document.body.insertAdjacentHTML('beforeend', formHtml);

const form = document.querySelector('.new-employee-form');
const notification = document.createElement('div');

notification.className = 'notification';
notification.setAttribute('data-qa', 'notification');
document.body.appendChild(notification);

const showNotification = (message, type) => {
  notification.innerHTML = `<span class="title">${type.toUpperCase()}</span> ${message}`;
  notification.className = `notification ${type}`;

  setTimeout(() => {
    notification.className = `notification`;
  }, 2000);
};

document.getElementById('save-button').addEventListener('click', () => {
  const newName = form.querySelector('input[name="name"]').value.trim();
  const position = form.querySelector('input[name="position"]').value.trim();
  const office = form.querySelector('select[name="office"]').value;
  const age = form.querySelector('input[name="age"]').value.trim();
  const salary = form.querySelector('input[name="salary"]').value.trim();

  let isValid = true;

  if (newName.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');
    isValid = false;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');
    isValid = false;
  }

  if (
    !position ||
    !office ||
    !salary ||
    isNaN(parseFloat(salary)) ||
    parseFloat(salary) <= 0
  ) {
    showNotification(
      'All fields are required and salary must be a positive number.',
      'error',
    );
    isValid = false;
  }

  if (isValid) {
    const newRow = document.createElement('tr');
    const formattedSalary = `$${parseFloat(salary).toLocaleString('en-US')}`;

    newRow.innerHTML = `
      <td>${newName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${formattedSalary}</td>
    `;
    table.querySelector('tbody').appendChild(newRow);
    showNotification('Employee added successfully!', 'success');

    form.reset();
  }
});

table.querySelectorAll('tbody td').forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const initialValue = cell.innerText;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;
    cell.innerText = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      cell.innerText = input.value.trim() || initialValue;
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        cell.innerText = input.value.trim() || initialValue;
      }
    });
  });
});
