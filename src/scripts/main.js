'use strict';

const getCellValue = (tr, idx) => tr.children[idx].textContent.trim();

const comparer = (idx, asc) => (a, b) => {
  const v1 = getCellValue(a, idx);
  const v2 = getCellValue(b, idx);

  if (!isNaN(parseFloat(v1)) && !isNaN(parseFloat(v2))) {
    return (asc ? 1 : -1) * (parseFloat(v1) - parseFloat(v2));
  }

  return (asc ? 1 : -1) * v1.localeCompare(v2, undefined, { numeric: true });
};

document.querySelectorAll('th').forEach((th) => {
  th.addEventListener('click', () => {
    const table = th.closest('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const index = Array.from(th.parentNode.children).indexOf(th);
    let isAsc = th.classList.contains('asc');

    isAsc = !isAsc;
    th.classList.toggle('asc', isAsc);
    th.classList.toggle('desc', !isAsc);

    rows.sort(comparer(index, isAsc));
    rows.forEach((row) => tbody.appendChild(row));
  });
});

document.querySelectorAll('tbody tr').forEach((tr) => {
  tr.addEventListener('click', () => {
    document.querySelectorAll('tbody tr').forEach((row) => {
      row.classList.remove('active');
    });

    tr.classList.add('active');
  });
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
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
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="text" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const namePerson = form.elements['name'].value.trim();
  const position = form.elements['position'].value.trim();
  const office = form.elements['office'].value.trim();
  const age = parseInt(form.elements['age'].value.trim(), 10);
  const salary = form.elements['salary'].value.trim().replace(/[^0-9.-]+/g, '');

  if (namePerson.length < 4) {
    showNotification('Name must be at least 4 characters long', 'error');

    return;
  }

  if (position.length === 0) {
    showNotification('Position must not be empty', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  if (isNaN(salary)) {
    showNotification('Salary must be a valid number', 'error');

    return;
  }

  const formattedSalary = '$' + parseFloat(salary).toLocaleString('en-US');

  const table = document.querySelector('table tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${namePerson}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  table.appendChild(row);

  showNotification('New employee added successfully', 'success');
  form.reset();
});

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.className = type;
  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

document.querySelectorAll('td').forEach((td) => {
  td.addEventListener('dblclick', () => {
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = td.textContent;
    input.defaultValue = td.textContent.trim();
    td.textContent = '';
    td.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      td.textContent = input.value.trim() || input.defaultValue;
      input.remove();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        td.textContent = input.value.trim() || input.defaultValue;
        input.remove();
      }
    });
  });
});
