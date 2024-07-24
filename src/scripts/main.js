'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const titles = thead.querySelectorAll('th');
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

const button = document.createElement('button');

const labelTitles = ['name', 'position', 'age', 'salary'];
const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatSalary(salary) {
  return '$' + parseFloat(salary).toLocaleString();
}

function sortTable(index, order) {
  const currentRows = tbody.querySelectorAll('tr');

  const sortedRows = Array.from(currentRows).sort((row1, row2) => {
    const cell1 = row1.children[index].innerText
      .replaceAll('$', '')
      .replaceAll(',', '');
    const cell2 = row2.children[index].innerText
      .replaceAll('$', '')
      .replaceAll(',', '');

    switch (order) {
      case 'asc':
        if (!isNaN(parseFloat(cell1)) && !isNaN(parseFloat(cell2))) {
          return cell1 - cell2;
        } else {
          return cell1.localeCompare(cell2);
        }

      case 'desc':
        if (!isNaN(parseFloat(cell1)) && !isNaN(parseFloat(cell2))) {
          return cell2 - cell1;
        } else {
          return cell2.localeCompare(cell1);
        }

      default:
        return 0;
    }
  });

  tbody.innerHTML = '';

  sortedRows.forEach((row) => {
    tbody.append(row);
  });
}

titles.forEach((title, index) => {
  title.addEventListener('click', () => {
    let sortOrder = 'desc';

    titles.forEach((t, i) => {
      if (i !== index) {
        t.removeAttribute('data-sort-order');
      }
    });

    const currentOrder = title.getAttribute('data-sort-order');

    if (currentOrder === 'asc') {
      sortOrder = 'desc';
    } else if (currentOrder === 'desc') {
      sortOrder = 'asc';
    } else {
      sortOrder = 'asc';
    }

    title.setAttribute('data-sort-order', sortOrder);

    sortTable(index, sortOrder);
  });
});

rows.forEach((row, index) => {
  row.addEventListener('click', () => {
    rows.forEach((r, i) => {
      if (i !== index) {
        r.removeAttribute('class');
      }
    });

    row.setAttribute('class', 'active');
  });
});

tbody.addEventListener('dblclick', (ev) => {
  const cell = ev.target.closest('td');

  if (tbody.querySelector('.editing')) {
    return;
  }

  const editingInput = document.createElement('input');

  editingInput.className = 'cell-input';

  const columnTitle = titles[cell.cellIndex].textContent.trim().toLowerCase();

  editingInput.type =
    columnTitle === 'age' || columnTitle === 'salary' ? 'number' : 'text';

  editingInput.value = cell.textContent.replaceAll('$', '').replaceAll(',', '');

  cell.classList.add('editing');
  cell.innerHTML = '';
  cell.append(editingInput);
  editingInput.focus();

  editingInput.addEventListener('blur', () => {
    let isValid = true;
    let errorMessage = '';

    if (editingInput.value.trim().length < 1) {
      isValid = false;
      errorMessage = 'All fields are required';
    } else if (
      columnTitle === 'name' &&
      (cell.textContent || editingInput.value.length < 4)
    ) {
      isValid = false;
      errorMessage = 'The name must contain at least 4 letters';
    } else if (columnTitle === 'age') {
      const age = parseInt(cell.textContent, 10);

      if (
        age < 18 ||
        age > 90 ||
        editingInput.value < 18 ||
        editingInput.value > 90
      ) {
        isValid = false;
        errorMessage = 'Age should be from 18 to 90 years';
      }
    } else if (columnTitle === 'salary') {
      const salary = parseFloat(
        editingInput.value.replaceAll('$', '').replaceAll(',', ''),
      );

      if (isNaN(salary) || salary < 0) {
        isValid = false;
        errorMessage = 'Salary should be a positive number';
      }
    }

    if (isValid) {
      cell.classList.remove('editing');

      if (columnTitle === 'salary') {
        cell.textContent =
          formatSalary(
            editingInput.value.replaceAll('$', '').replaceAll(',', ''),
          ) || cell.textContent;
      } else {
        cell.innerHTML = editingInput.value.trim() || cell.textContent;
      }

      showNotification(
        'success',
        'Success',
        'The employee was updated successfully',
      );
    } else {
      showNotification('error', 'Error', errorMessage);
      editingInput.focus();
    }
  });

  editingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      editingInput.blur();
    }
  });
});

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';
  button.textContent = 'Save to table';
  button.type = 'button';

  labelTitles.forEach((title, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.textContent = `${capitalizeFirstLetter(title)}: `;

    if (title === 'age' || title === 'salary') {
      input.type = 'number';
    } else {
      input.type = 'text';
    }

    input.setAttribute('name', title);
    input.setAttribute('data-qa', title);
    input.setAttribute('required', true);

    label.append(input);

    if (index === 2) {
      const selectLabel = document.createElement('label');
      const select = document.createElement('select');

      selectLabel.textContent = 'Office';
      select.setAttribute('data-qa', 'office');

      selectOptions.forEach((optionText) => {
        const option = document.createElement('option');

        option.value = optionText;
        option.textContent = optionText;
        select.append(option);
      });

      selectLabel.append(select);
      form.append(selectLabel);
    }

    form.append(label);
  });

  form.append(button);
  body.append(form);
}

function addEmployee(newEmployee) {
  const newRow = document.createElement('tr');

  Object.values(newEmployee).forEach((data) => {
    const cell = document.createElement('td');

    cell.textContent = data;
    newRow.append(cell);
  });

  tbody.append(newRow);
  document.querySelector('.new-employee-form').reset();
}

createForm();

function showNotification(type, notTitle, notDescription) {
  const oldNotification = body.querySelectorAll('[data-qa="notification"]');

  oldNotification.forEach((n) => n.remove());

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;

  const title = document.createElement('h2');

  title.textContent = notTitle;
  notification.append(title);

  const description = document.createElement('p');

  description.textContent = notDescription;
  notification.append(description);

  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

button.addEventListener('click', () => {
  const form = document.querySelector('.new-employee-form');
  const inputs = form.querySelectorAll('input');
  const select = form.querySelector('select');
  const inputName = inputs[0].value;
  const age = parseInt(inputs[2].value, 10);

  let isDataValid = true;
  let errorMessage = '';

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isDataValid = false;
      errorMessage = 'All fields are required';
    }
  });

  if (isDataValid) {
    if (inputName.length < 4) {
      isDataValid = false;
      errorMessage = 'The name must contain at least 4 letters';
    }

    if (age < 18 || age > 90) {
      isDataValid = false;
      errorMessage = 'Age should be from 18 to 90 years';
    }
  }

  if (isDataValid) {
    addEmployee({
      name: inputs[0].value,
      position: inputs[1].value,
      office: select.value,
      age: inputs[2].value,
      salary: formatSalary(inputs[3].value),
    });

    showNotification(
      'success',
      'Success',
      'The employee was added successfully',
    );
  } else {
    showNotification('error', 'Error', errorMessage);
  }
});
