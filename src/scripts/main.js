'use strict';

const tbody = document.querySelector('tbody');
const body = document.querySelector('body');
const theader = document.querySelector('thead');
const rowsCollection = tbody.children;

const sortingState = {};

theader.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const sortedBy = e.target.textContent;

    const currentState = sortingState[sortedBy];

    sortingState[sortedBy] = currentState === 'asc' ? 'desc' : 'asc';

    const rows = [...rowsCollection];

    switch (sortedBy) {
      case 'Name':
        sortRows(rows, compareTextData(0, sortingState[sortedBy]));
        break;

      case 'Position':
        sortRows(rows, compareTextData(1, sortingState[sortedBy]));
        break;

      case 'Office':
        sortRows(rows, compareTextData(2, sortingState[sortedBy]));
        break;

      case 'Age':
        sortRows(rows, compareNumbers(3, sortingState[sortedBy]));
        break;

      case 'Salary':
        sortRows(rows, compareSalaryData(4, sortingState[sortedBy]));
        break;

      default:
        break;
    }

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.append(row));
  }
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  rowsCollection.forEach(
    (row) => row !== clickedRow && row.classList.remove('active'),
  );

  clickedRow.classList.toggle('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.method = 'post';

form.innerHTML = `
<label>Name: <input id="name" data-qa="name" name="name" type="text" required></label>
<label>Position: <input
  id="position" data-qa="position" name="position" type="text" required></label>
<label>Office: <select data-qa="office" name="office">
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
  </select>
</label>
<label>Age: <input
  data-qa="age" name="age" type="number" required></label>
<label>Salary:
  <input data-qa="salary" name="salary" type="number" required>
</label>
<button type="submit">Save to table</button>
`;

body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const formName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = parseInt(formData.get('age'));
  const salary = parseSalary(formData.get('salary'));
  const inputName = document.getElementById('name');
  const inputPosition = document.getElementById('position');

  if (formName.length < 4) {
    pushNote(
      10,
      10,
      'Error',
      'Name must be at least 4 characters long.',
      'error',
    );

    return;
  }

  if (inputName.value.trim() === '' || inputPosition.value.trim() === '') {
    pushNote(10, 10, 'Error', 'This field cannot be empty', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNote(10, 10, 'Error', 'Age must be between 18 and 90.', 'error');

    return;
  }

  if (!Number.isFinite(salary) || salary <= 0) {
    pushNote(10, 10, 'Error', 'Invalid salary value.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${formName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(newRow);
  pushNote(10, 10, 'Success', 'New employee added successfully.', 'success');

  form.reset();
});

const pushNote = (posTop, posRight, title, description, type) => {
  const note = document.createElement('div');
  const noteTitle = document.createElement('h2');
  const noteDescription = document.createElement('p');

  note.className = `notification ${type}`;
  noteTitle.classList.add('title');

  note.style.top = posTop + 'px';
  note.style.right = posRight + 'px';
  noteTitle.textContent = title;
  noteDescription.textContent = description;

  note.append(noteTitle, noteDescription);
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 2000);
};

function sortRows(rows, comparator) {
  rows.sort(comparator);
}

function compareTextData(columnIndex, sortOrder) {
  return (r1, r2) => {
    const value1 = r1.cells[columnIndex].textContent.trim();
    const value2 = r2.cells[columnIndex].textContent.trim();

    return sortOrder === 'asc'
      ? value1.localeCompare(value2)
      : value2.localeCompare(value1);
  };
}

function compareNumbers(columnIndex, sortOrder) {
  return (r1, r2) => {
    const value1 = +r1.cells[columnIndex].textContent;
    const value2 = +r2.cells[columnIndex].textContent;

    return sortOrder === 'asc' ? value1 - value2 : value2 - value1;
  };
}

function compareSalaryData(columnIndex, sortOrder) {
  return (r1, r2) => {
    const value1 = parseSalary(r1.cells[columnIndex].textContent);
    const value2 = parseSalary(r2.cells[columnIndex].textContent);

    return sortOrder === 'asc' ? value1 - value2 : value2 - value1;
  };
}

function parseSalary(salaryString) {
  return parseFloat(salaryString.replace(/[^0-9.-]+/g, ''));
}
