document.addEventListener('DOMContentLoaded', () => {
  const thead = document.querySelector('thead');
  const tbody = document.querySelector('tbody');
  const theadCells = Array.from(thead.rows[0].cells);
  const sortOrders = {};

  theadCells.forEach((cell, index) => {
    sortOrders[index] = 'asc';
  });

  const sortTable = (columnIndex, order) => {
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
      const valueA = a.cells[columnIndex].textContent.trim();
      const valueB = b.cells[columnIndex].textContent.trim();

      return order === 'asc'
        ? valueA.localeCompare(valueB, 'en', { numeric: true })
        : valueB.localeCompare(valueA, 'en', { numeric: true });
    });

    const fragment = document.createDocumentFragment();

    rows.forEach((row) => fragment.appendChild(row));
    tbody.appendChild(fragment);
  };

  theadCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      const currentOrder = sortOrders[index];

      sortTable(index, currentOrder);

      sortOrders[index] = currentOrder === 'asc' ? 'desc' : 'asc';
    });
  });

  const setActiveClass = (row) => {
    const activeRow = tbody.querySelector('.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }
    row.classList.add('active');
  };

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (row && !row.classList.contains('active')) {
      setActiveClass(row);
    }
  });

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const formInputs = [
    { inputName: 'name', type: 'text' },
    { inputName: 'position', type: 'text' },
    {
      inputName: 'office',
      type: 'select',
      options: [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ],
    },
    { inputName: 'age', type: 'number' },
    { inputName: 'salary', type: 'number' },
  ];

  formInputs.forEach(({ inputName, type, options }) => {
    const label = document.createElement('label');

    label.textContent = `${inputName.charAt(0).toUpperCase() + inputName.slice(1)}: `;

    const input = document.createElement(
      type === 'select' ? 'select' : 'input',
    );

    input.name = inputName;
    input.setAttribute('data-qa', inputName);

    if (type === 'select') {
      options.forEach((option) => input.add(new Option(option)));
    } else {
      input.type = type;
    }

    label.appendChild(input);
    form.appendChild(label);
  });

  form.appendChild(
    Object.assign(document.createElement('button'), {
      type: 'submit',
      textContent: 'Save to table',
    }),
  );

  document.body.appendChild(form);

  const pushNotification = (description, type) => {
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');

    notification.innerHTML = `
      <h2 class='title'>${type}</h2>
      <p>${description}</p>
    `;
    document.body.append(notification);
    setTimeout(() => (notification.style.display = 'none'), 2000);
  };

  const validators = {
    name: (value) =>
      value.trim().length >= 4 || 'Name must be at least 4 characters long',
    age: (value) =>
      (!isNaN(value) && value >= 18 && value <= 90) ||
      'Age must be between 18 and 90',
    position: (value) => value.trim().length > 0 || 'Position cannot be empty',
    salary: (value) => {
      const salary = parseFloat(value.replace(/[$,]/g, ''));

      return (
        (!isNaN(salary) && salary >= 0) || 'Salary must be a positive number'
      );
    },
  };

  const validateData = (inputName, value) => {
    if (inputName === 'office') {
      return null;
    }

    const isValid = validators[inputName](value);

    return isValid === true ? null : { type: 'error', message: isValid };
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    for (const [key, value] of formData.entries()) {
      const validationError = validateData(key, value);

      if (validationError) {
        pushNotification(validationError.message, validationError.type);

        return;
      }
    }

    const newRow = document.createElement('tr');

    formData.forEach((value, key) => {
      const cell = document.createElement('td');

      if (key === 'salary') {
        cell.textContent = '$' + Number(value).toLocaleString('en-US');
      } else {
        cell.textContent = value;
      }

      newRow.appendChild(cell);
    });

    tbody.appendChild(newRow);
    form.reset();

    pushNotification('Employee added successfully', 'success');
  });

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target;
    const initialValue = cell.textContent.trim();

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.type = 'text';
    input.value = initialValue;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => saveChanges(input, initialValue));

    input.addEventListener('keypress', (kpEvent) => {
      if (kpEvent.key === 'Enter') {
        saveChanges(input, initialValue);
      }
    });
  });

  const saveChanges = (input, initialValue) => {
    const newValue = input.value.trim() || initialValue;
    const cell = input.parentElement;

    cell.textContent = newValue;
    input.remove();
  };
});
