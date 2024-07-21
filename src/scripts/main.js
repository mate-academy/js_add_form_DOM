'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortTableByColumn(index);
  });
});

const sortDirections = Array(headers.length).fill(true);

function sortTableByColumn(columnIndex) {
  const rowsArray = Array.from(tbody.querySelectorAll('tr'));
  const isAscending = sortDirections[columnIndex];

  sortDirections[columnIndex] = !isAscending;

  const sortedRows = rowsArray.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].innerText;
    const cellB = rowB.cells[columnIndex].innerText;

    if (headers[columnIndex].innerText === 'Age') {
      return isAscending
        ? parseInt(cellA) - parseInt(cellB)
        : parseInt(cellB) - parseInt(cellA);
    }

    if (headers[columnIndex].innerText === 'Salary') {
      return (
        parseFloat(cellA.replace(/[$,]/g, '')) -
        parseFloat(cellB.replace(/[$,]/g, ''))
      );
    }

    return cellA.localeCompare(cellB);
  });

  sortedRows.forEach((row) => tbody.appendChild(row));
}

tbody.addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    const row = e.target.parentNode;

    tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
    row.classList.add('active');
  }
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', `notification ${type}`);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;
  notification.appendChild(h2);
  notification.appendChild(p);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label for="employeeName">
    Name:
    <input data-qa="name" type="text" id="employeeName" name="employeeName">
  </label>
  <label for="position">
    Position:
    <input data-qa="position" type="text" id="position" name="position">
  </label>
  <label for="office">
    Office:
    <select data-qa="office" id="office" name="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label for="age">
    Age:
    <input data-qa="age" type="number" id="age" name="age">
  </label>
  <label for="salary">
    Salary:
    <input data-qa="salary" type="number" id="salary" name="salary">
  </label>
  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

function salaryFormat(number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.employeeName.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = form.age.value;
  const salary = form.salary.value;

  if (employeeName.trim().length < 4) {
    pushNotification(100, 5, 'Error', 'Name must be grater than 4', 'error');
  }

  if (age < 18 || age > 90) {
    pushNotification(220, 5, 'Error', 'Age must be between 18 and 90', 'error');
  }

  if (
    employeeName.trim().length >= 4 &&
    position.trim() &&
    office &&
    age > 18 &&
    age < 90 &&
    salary
  ) {
    const newRow = document.createElement('tr');
    const salaryFormated = salaryFormat(parseFloat(salary));

    newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salaryFormated}</td>
  `;
    tbody.appendChild(newRow);
    form.reset();

    pushNotification(
      220,
      5,
      'Success',
      'Employee was successfully added',
      'success',
    );
  } else {
    pushNotification(340, 5, 'Error', 'All fields must be filled!', 'error');
  }
});

tbody.addEventListener('dblclick', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    const cell = e.target;
    const originalContent = cell.innerText;

    cell.innerText = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.value = originalContent;
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      saveCellContent(cell, input, originalContent);
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveCellContent(cell, input, originalContent);
      }
    });
  }
});

function saveCellContent(cell, input, originalContent) {
  const newContent = input.value.trim();

  if (newContent) {
    if (cell.innerText === 'Salary') {
      const salary = parseFloat(newContent.replace(/[$,]/g, ''));

      if (!isNaN(salary)) {
        cell.innerText = salaryFormat(salary);
      } else {
        cell.innerText = originalContent;
        pushNotification('Error', 'Invalid salary format!', 'error');
      }
    } else {
      cell.innerText = newContent;
    }
  } else {
    cell.innerText = originalContent;
  }
}
