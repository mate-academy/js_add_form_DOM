'use strict';

// write code here
const body = document.querySelector('body');
const table = document.querySelector('table');
const headers = table.querySelectorAll('thead tr th');
const tableBody = table.querySelector('tbody');
const sortOrder = [];

const div = document.createElement('div');

div.setAttribute('data-qa', 'notification');

const h2 = document.createElement('h2');

div.classList.add('notification');
div.style.top = '290px';
div.style.right = '10px';
div.style.zIndex = '1';
div.style.display = 'none';

h2.classList.add('title');

div.appendChild(h2);
body.appendChild(div);

headers.forEach((header, index) => {
  sortOrder[index] = true;

  header.addEventListener('click', () => {
    sortTable(index, sortOrder[index]);
    sortOrder[index] = !sortOrder[index];
  });
}); // Сортування елементів

function sortTable(index, ascending) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const sortedRows = rows.sort((a, b) => {
    let aText = a.querySelectorAll('td')[index].textContent.trim();
    let bText = b.querySelectorAll('td')[index].textContent.trim();

    if (index === 3) {
      aText = parseInt(aText, 10);
      bText = parseInt(bText, 10);
    } else if (index === 4) {
      aText = Number(aText.replace(/[$,]/g, ''));
      bText = Number(bText.replace(/[$,]/g, ''));
    }

    if (aText > bText) {
      return ascending ? 1 : -1;
    } else if (aText < bText) {
      return ascending ? -1 : 1;
    } else {
      return 0;
    }
  });

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  tbody.append(...sortedRows);
} // Функція для сортування

// eslint-disable-next-line no-shadow
tableBody.addEventListener('click', (event) => {
  const selected = event.target.closest('tr');

  if (!selected) {
    return;
  }

  body.querySelectorAll('tr.active').forEach((tr) => {
    tr.classList.remove('active');
  });
  selected.classList.add('active');
}); // івент на виділення елемента

// Створення форми
const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  const input = document.createElement('input');

  input.name = field.name;
  input.type = field.type;
  input.setAttribute('data-qa', field.qa);

  label.appendChild(input);
  form.appendChild(label);
  form.appendChild(document.createElement('br'));
});

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const select = document.createElement('select');

select.name = 'office';
select.setAttribute('data-qa', 'office');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  select.appendChild(option);
});

officeLabel.appendChild(select);
form.appendChild(officeLabel);
form.appendChild(document.createElement('br'));

const remainingFields = [
  {
    label: 'Age:',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

remainingFields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  const input = document.createElement('input');

  input.name = field.name;
  input.type = field.type;
  input.setAttribute('data-qa', field.qa);

  label.appendChild(input);
  form.appendChild(label);

  form.appendChild(document.createElement('br'));
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

body.appendChild(form);

// eslint-disable-next-line no-shadow
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const names = form.elements['name'].value.trim();
  const position = form.elements['position'].value.trim();
  const office = form.elements['office'].value.trim();
  const age = parseInt(form.elements['age'].value, 10);
  const salary = parseFloat(form.elements['salary'].value);

  if (!document.body.contains(div)) {
    document.body.appendChild(div);
  }

  if (!names || !position || !office || isNaN(age) || isNaN(salary)) {
    div.classList.add('error');
    h2.textContent = 'All fields must be filled!';
    div.style.display = 'block';

    setTimeout(() => {
      if (document.body.contains(div)) {
        document.body.removeChild(div);
      }
    }, 2000);

    return;
  }

  if (names.length < 4) {
    div.classList.add('error');
    h2.textContent = 'The name must contain more than 4 letters!';
    div.style.display = 'block';

    setTimeout(() => {
      if (document.body.contains(div)) {
        document.body.removeChild(div);
      }
    }, 2000);

    return;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    div.classList.add('error');
    h2.textContent = 'Age should be between 18 and 90 years!';
    div.style.display = 'block';

    setTimeout(() => {
      if (document.body.contains(div)) {
        document.body.removeChild(div);
      }
    }, 2000);

    return;
  }

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(salary);

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${names}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  tableBody.appendChild(newRow);

  div.classList.remove('error');
  div.classList.add('success');
  h2.textContent = 'Congratulations employee added!';
  div.style.display = 'block';

  setTimeout(() => {
    if (document.body.contains(div)) {
      document.body.removeChild(div);
    }
  }, 2000);

  form.reset();
});

// створення форми

let originalValue = '';

// eslint-disable-next-line no-shadow
tableBody.addEventListener('dblclick', (event) => {
  const cell = event.target.closest('td');

  if (!cell) {
    return;
  }

  originalValue = cell.textContent.trim();

  const input = document.createElement('input');

  input.value = originalValue;

  input.classList.add('cell-input');
  input.style.boxSizing = 'border-box';

  cell.innerHTML = '';
  cell.appendChild(input);
  input.focus();
});

tableBody.addEventListener(
  'blur',
  // eslint-disable-next-line no-shadow
  (event) => {
    const cell = event.target.closest('td');

    if (!cell || !cell.querySelector('input')) {
      return;
    }

    const input = cell.querySelector('input');
    const newValue = input.value.trim();

    if (newValue === '') {
      div.classList.add('error');
      h2.textContent = 'The field cannot be empty!';
      div.style.display = 'block';

      setTimeout(() => {
        if (document.body.contains(div)) {
          document.body.removeChild(div);
        }
      }, 2000);

      cell.textContent = originalValue;

      return;
    }

    const columIndex = Array.from(cell.parentNode.children).indexOf(cell);

    if (columIndex === 0 && newValue.length < 4) {
      div.classList.add('error');
      h2.textContent = 'The name must contain more than 4 letters!';
      div.style.display = 'block';

      setTimeout(() => {
        if (document.body.contains(div)) {
          document.body.removeChild(div);
        }
      }, 2000);

      cell.textContent = originalValue;

      return;
    }

    if (columIndex === 3) {
      const age = parseInt(newValue, 10);

      if (isNaN(age) || age < 18 || age > 90) {
        div.classList.add('error');
        h2.textContent = 'Age should be between 18 and 90 years!';
        div.style.display = 'block';

        setTimeout(() => {
          if (document.body.contains(div)) {
            document.body.removeChild(div);
          }
        }, 2000);

        cell.textContent = originalValue;

        return;
      }
    }

    cell.textContent = newValue;
  },
  true,
);

tableBody.addEventListener(
  'keydown',
  // eslint-disable-next-line no-shadow
  (event) => {
    if (event.key === 'Enter') {
      const cell = event.target.closest('td');

      if (!cell || !cell.querySelector('input')) {
        return;
      }

      const input = cell.querySelector('input');
      const newValue = input.value.trim();

      if (newValue === '') {
        div.classList.add('error');
        h2.textContent = 'The field cannot be empty!';
        div.style.display = 'block';

        setTimeout(() => {
          if (document.body.contains(div)) {
            document.body.removeChild(div);
          }
        }, 2000);

        cell.textContent = originalValue;

        return;
      }

      const columIndex = Array.from(cell.parentNode.children).indexOf(cell);

      if (columIndex === 0 && newValue.length < 4) {
        div.classList.add('error');
        h2.textContent = 'The name must contain more than 4 letters!';
        div.style.display = 'block';

        setTimeout(() => {
          if (document.body.contains(div)) {
            document.body.removeChild(div);
          }
        }, 2000);

        cell.textContent = originalValue;

        return;
      }

      if (columIndex === 3) {
        const age = parseInt(newValue, 10);

        if (isNaN(age) || age < 18 || age > 90) {
          div.classList.add('error');
          h2.textContent = 'Age should be between 18 and 90 years!';
          div.style.display = 'block';

          setTimeout(() => {
            if (document.body.contains(div)) {
              document.body.removeChild(div);
            }
          }, 2000);

          cell.textContent = originalValue;

          return;
        }
      }
      cell.textContent = newValue;
    }
  },
  true,
);
