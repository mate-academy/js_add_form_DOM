'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

let lastSortedColumnIndex = -1;

headers.forEach((header) => (header.dataset.sortOrder = 'asc'));

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (index !== lastSortedColumnIndex) {
      header.dataset.sortOrder = 'asc';
    }

    const sortOrder = header.dataset.sortOrder;
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
      const aText = a
        .querySelectorAll('td')
        [index].textContent.trim()
        .replace(/[$,]/g, '');
      const bText = b
        .querySelectorAll('td')
        [index].textContent.trim()
        .replace(/[$,]/g, '');

      let comparison = 0;

      if (!isNaN(parseFloat(aText)) && !isNaN(parseFloat(bText))) {
        comparison = parseFloat(aText) - parseFloat(bText);
        // parseFloat()- convert text values into num;
      } else {
        comparison = aText.localeCompare(bText);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    lastSortedColumnIndex = index;

    header.dataset.sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    sortedRows.forEach((row) => tbody.appendChild(row));
  });
});

tbody.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tr');

  if (!selectedRow) {
  }

  tbody.querySelectorAll('tr').forEach((row) => {
    row.classList.remove('active');
  });

  selectedRow.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

function createInput(labelText, inputName, dataQa, inputType = 'text') {
  const label = document.createElement('label');

  label.textContent = labelText + ': ';

  const input = document.createElement('input');

  input.name = inputName;
  input.type = inputType;
  input.setAttribute('data-qa', dataQa);
  input.required = true;

  label.appendChild(input);

  return label;
}

form.appendChild(createInput('Name', 'name', 'name'));
form.appendChild(createInput('Position', 'position', 'position'));

const selectLabel = document.createElement('label');

selectLabel.textContent = 'Office: ';

const select = document.createElement('select');

select.name = 'office';
select.setAttribute('data-qa', 'office');
select.required = true;

const officeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

officeOptions.forEach((option) => {
  const opt = document.createElement('option');

  opt.value = option;
  opt.textContent = option;

  select.appendChild(opt);
});

selectLabel.appendChild(select);

form.appendChild(selectLabel);

form.appendChild(createInput('Age', 'age', 'age', 'number'));
form.appendChild(createInput('Salary', 'salary', 'salary', 'number'));

const submitButton = document.createElement('button');

submitButton.type = 'submit';

submitButton.textContent = 'Save to table';

form.appendChild(submitButton);

document.body.append(form);

function showNotification(message, isError = false) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = isError ? 'error' : 'success';
  notification.classList.add('notification');

  const title = document.createElement('h2');
  const description = document.createElement('p');

  title.classList.add('title');
  title.textContent = isError ? 'Error' : 'Success';
  description.textContent = message;
  notification.append(title, description);
  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  const nameEmployee = form.name.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = parseFloat(form.age.value, 10);
  const salary = parseFloat(form.salary.value);

  let valid = true;
  let errorMessage = '';

  if (nameEmployee.length < 4) {
    valid = false;
    errorMessage += 'Name must be at least 4 characters long. ';
  }

  if (age < 18 || age > 90) {
    valid = false;
    errorMessage += 'Age must be between 18 and 90. ';
  }

  if (position.trim().length < 4) {
    valid = false;
    errorMessage += 'Position must be at least 4 characters long. ';
  }

  if (!valid) {
    showNotification(errorMessage, true);

    return;
  }

  const newRow = document.createElement('tr');

  const nameCell = document.createElement('td');

  nameCell.textContent = nameEmployee;
  newRow.appendChild(nameCell);

  const positionCell = document.createElement('td');

  positionCell.textContent = position;
  newRow.appendChild(positionCell);

  const officeCell = document.createElement('td');

  officeCell.textContent = office;
  newRow.appendChild(officeCell);

  const ageCell = document.createElement('td');

  ageCell.textContent = age;
  newRow.appendChild(ageCell);

  const salaryCell = document.createElement('td');

  salaryCell.textContent = formatCurrency(salary);
  newRow.appendChild(salaryCell);

  tbody.appendChild(newRow);

  form.reset();

  showNotification('Employee successfully added to the table!');
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }
  // contentEditable= HTML attribute, allows you to edit the item

  if (td.contentEditable === 'true') {
    return;
  }

  td.contentEditable = 'true';
  td.focus();

  const handleBlur = () => {
    td.contentEditable = 'false';
    td.removeEventListener('blur', handleBlur);
    td.removeEventListener('keydown', handleKeydown);
  };

  const handleKeydown = (down) => {
    if (down.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  };

  td.addEventListener('blur', handleBlur);
  td.addEventListener('keydown', handleKeydown);
});
