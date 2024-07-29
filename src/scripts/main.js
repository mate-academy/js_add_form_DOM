'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form');
  const body = document.querySelector('body');
  const table = document.querySelector('table');
  const headRow = document.querySelector('thead tr');
  const bodyTable = document.querySelector('tbody');
  let currentSortColumn = null;
  let selectedRow = null;
  let currentSortOrder = 'asc';

  bodyTable.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    row.classList.toggle('active');

    if (selectedRow !== row) {
      selectedRow?.classList.remove('active');
    }
    selectedRow = row;
  });

  form.setAttribute('class', 'new-employee-form');

  form.insertAdjacentHTML(
    'beforeend',
    `<label>Name: <input data-qa="name" name="name" type="text"></label>`,
  );

  form.insertAdjacentHTML(
    'beforeend',
    `<label>Position: <input data-qa="position" name="position" type="text"></label>`,
  );

  form.insertAdjacentHTML(
    'beforeend',
    `<label>Office: <select data-qa="office" name="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
      </select></label>`,
  );

  form.insertAdjacentHTML(
    'beforeend',
    `<label>Age: <input data-qa="age" name="age" type="number" min="18" max="90"></label>`,
  );

  form.insertAdjacentHTML(
    'beforeend',
    `<label>Salary: <input data-qa="salary" name="salary" type="number"></label>`,
  );

  form.insertAdjacentHTML(
    'beforeend',
    `<button class="button button--save" type="button">Save to table</button>`,
  );

  body.appendChild(form);

  const createSalary = (salary) => {
    const number = Number(salary);

    return `$${number.toLocaleString('en-US')}`;
  };

  const createRow = (employee) => {
    const tr = document.createElement('tr');

    tr.insertAdjacentHTML('beforeend', `<td>${employee.NAME}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td>${employee.position}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td>${employee.office}</td>`);
    tr.insertAdjacentHTML('beforeend', `<td>${employee.age}</td>`);

    tr.insertAdjacentHTML(
      'beforeend',
      `<td>${createSalary(employee.salary)}</td>`,
    );

    return tr;
  };

  const button = document.querySelector('.button');

  button.addEventListener('click', () => {
    const NAME = form.querySelector('[name="name"]').value;
    const position = form.querySelector('[name="position"]').value;
    const office = form.querySelector('[name="office"]').value;
    const age = form.querySelector('[name="age"]').value;
    const salary = form.querySelector('[name="salary"]').value;

    const employee = {
      NAME,
      position,
      office,
      age,
      salary,
    };

    if (!validateForm(NAME, position, age, salary)) {
      return;
    }

    const newRow = createRow(employee);

    table.querySelector('tbody').appendChild(newRow);
    pushNotification('Success!', 'You add a new employee', 'success');

    form.reset();
  });

  function pushNotification(title, description, type) {
    const notification = document.createElement('div');

    notification.style.top = `18px`;
    notification.style.right = `18px`;

    const titleNotification = document.createElement('h2');
    const descriptionNotification = document.createElement('p');

    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('notification');
    notification.classList.add(type);
    titleNotification.classList.add('title');
    descriptionNotification.classList.add('description');

    titleNotification.textContent = title;
    descriptionNotification.textContent = description;

    notification.appendChild(titleNotification);
    notification.appendChild(descriptionNotification);

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.display = 'none';
    }, 4000);
  }

  function validateForm(nameValue, positionValue, ageValue, salaryValue) {
    if (!nameValue || !positionValue || !ageValue || !salaryValue) {
      pushNotification('Error!', 'All fields should be filled', 'error');

      return false;
    }

    if (nameValue.length < 4) {
      pushNotification(
        'Error!',
        'Name length should be more than 4 symbols',
        'error',
      );

      return false;
    }

    if (ageValue < 18 || ageValue > 90) {
      pushNotification('Error!', 'Age should be in range [18, 90]', 'error');

      return false;
    }

    return true;
  }

  function sortTable(columnIndex, order) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      const cellA = a.children[columnIndex].textContent;
      const cellB = b.children[columnIndex].textContent;

      if (columnIndex === 4) {
        const valueA = Number(cellA.replace(/[^0-9.-]+/g, ''));
        const valueB = Number(cellB.replace(/[^0-9.-]+/g, ''));

        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (columnIndex === 3) {
        const valueA = Number(cellA);
        const valueB = Number(cellB);

        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return order === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    rows.forEach((row) => tbody.appendChild(row));
  }

  headRow.addEventListener('click', (ev) => {
    const target = ev.target;
    const columnIndex = Array.from(target.parentNode.children).indexOf(target);

    if (currentSortColumn === columnIndex) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortOrder = 'asc';
    }

    currentSortColumn = columnIndex;
    sortTable(columnIndex, currentSortOrder);
  });
});
