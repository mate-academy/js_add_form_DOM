'use strict';

// write code here
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  let currentSortColumn = null;
  let sortDirection = 'asc';

  table.querySelectorAll('thead th').forEach((th) => {
    th.addEventListener('click', () => {
      const column = th.cellIndex;
      const type = th.innerText.toLowerCase();

      if (currentSortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortColumn = column;
        sortDirection = 'asc';
      }

      sortTable(column, type);
    });
  });

  function sortTable(column, type) {
    const rowsArray = Array.from(table.tBodies[0].rows);

    rowsArray.sort((rowA, rowB) => {
      const cellA = rowA.cells[column].innerText;
      const cellB = rowB.cells[column].innerText;

      if (type === 'age' || type === 'salary') {
        return sortDirection === 'asc'
          ? parseFloat(cellA.replace(/[$,]/g, '')) -
              parseFloat(cellB.replace(/[$,]/g, ''))
          : parseFloat(cellB.replace(/[$,]/g, '')) -
              parseFloat(cellA.replace(/[$,]/g, ''));
      }

      return sortDirection === 'asc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    rowsArray.forEach((row) => table.tBodies[0].append(row));
  }

  table.querySelectorAll('tbody tr').forEach((tr) => {
    tr.addEventListener('click', () => {
      table
        .querySelectorAll('tbody tr')
        .forEach((row) => row.classList.remove('active'));
      tr.classList.add('active');
    });
  });

  const formHtml = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name" required></label>
      <label>Position: <input name="position" type="text" data-qa="position" required></label>
      <label>Office:
        <select name="office" data-qa="office" required>
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age: <input name="age" type="number" data-qa="age" required></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
      <button type="submit">Save to table</button>
    </form>
    <div id="notification" data-qa="notification"></div>
  `;

  document.body.insertAdjacentHTML('beforeend', formHtml);

  const form = document.querySelector('.new-employee-form');
  const notification = document.querySelector('#notification');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const sName = form.name.value;
    const position = form.position.value;
    const office = form.office.value;
    const age = form.age.value;
    const salary = form.salary.value;

    if (sName.length < 4) {
      showNotification('Name should have at least 4 letters', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age should be between 18 and 90', 'error');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${sName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${parseFloat(salary).toFixed(2)}</td>
    `;
    table.querySelector('tbody').appendChild(newRow);

    newRow.addEventListener('click', () => {
      table
        .querySelectorAll('tbody tr')
        .forEach((row) => row.classList.remove('active'));
      newRow.classList.add('active');
    });

    showNotification('New employee added successfully', 'success');
    form.reset();
  });

  function showNotification(message, type) {
    notification.textContent = message;
    notification.className = type;

    setTimeout(() => {
      notification.textContent = '';
      notification.className = '';
    }, 3000);
  }

  table.querySelectorAll('tbody td').forEach((td) => {
    td.addEventListener('dblclick', () => {
      const currentText = td.textContent;

      td.innerHTML = `<input class="cell-input" type="text" value="${currentText}" />`;

      const input = td.querySelector('.cell-input');

      input.focus();

      input.addEventListener('blur', () => {
        const newText = input.value.trim();

        td.textContent = newText || currentText;
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const newText = input.value.trim();

          td.textContent = newText || currentText;
        }
      });
    });
  });
});
