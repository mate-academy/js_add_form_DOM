'use strict';

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const rows = tableBody.rows;

tableHead.addEventListener('click', (e) => {
  const columnName = e.target.closest('th');

  if (!columnName) {
    return;
  }

  if (
    !columnName.hasAttribute('direction') ||
    columnName.getAttribute('direction') === 'desc'
  ) {
    columnName.setAttribute('direction', 'asc');
  } else {
    columnName.setAttribute('direction', 'desc');
  }

  const people = [];

  for (const row of rows) {
    people.push({
      Name: row.cells[0].textContent,
      Position: row.cells[1].textContent,
      Office: row.cells[2].textContent,
      Age: row.cells[3].textContent,
      Salary: row.cells[4].textContent,
    });
  }

  const sortedName = columnName.textContent.trim();

  people.sort((person1, person2) => {
    if (
      sortedName === 'Name' ||
      sortedName === 'Office' ||
      sortedName === 'Position'
    ) {
      return columnName.getAttribute('direction') === 'asc'
        ? person1[sortedName].localeCompare(person2[sortedName])
        : person2[sortedName].localeCompare(person1[sortedName]);
    }

    if (sortedName === 'Age') {
      return columnName.getAttribute('direction') === 'asc'
        ? parseInt(person1[sortedName]) - parseInt(person2[sortedName])
        : parseInt(person2[sortedName]) - parseInt(person1[sortedName]);
    }

    if (sortedName === 'Salary') {
      const salary1 = parseInt(person1[sortedName].replace(/[^0-9]/g, ''), 10);
      const salary2 = parseInt(person2[sortedName].replace(/[^0-9]/g, ''), 10);

      return columnName.getAttribute('direction') === 'asc'
        ? salary1 - salary2
        : salary2 - salary1;
    }
  });

  tableBody.innerHTML = '';

  for (const person of people) {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${person.Name}</td>
      <td>${person.Position}</td>
      <td>${person.Office}</td>
      <td>${person.Age}</td>
      <td>${person.Salary}</td>
    `;

    tableBody.appendChild(row);
  }

  return 0;
});

tableBody.addEventListener('click', (e) => {
  const targetRow = e.target.closest('tr');

  if (!targetRow) {
    return;
  }

  for (const row of rows) {
    row.classList.remove('active');
  }

  targetRow.classList.add('active');
});

const body = document.querySelector('body');
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
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
`;

body.appendChild(form);

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationMessage = document.createElement('p');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  notificationTitle.textContent = title;
  notificationTitle.className = 'title';
  notificationMessage.innerHTML = description;
  notification.appendChild(notificationTitle);
  notification.appendChild(notificationMessage);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
};

const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    !form.querySelector('input[name="name"]').value ||
    !form.querySelector('input[name="position"]').value
  ) {
    pushNotification('Error message', 'Please fill out all fields!', 'error');

    return;
  }

  if (form.querySelector('input[name="name"]').value.length < 4) {
    pushNotification(
      'Error message',
      'Please enter a name with more than four characters.',
      'error',
    );

    return;
  }

  if (
    form.querySelector('input[name="age"]').value < 18 ||
    form.querySelector('input[name="age"]').value > 90
  ) {
    pushNotification(
      'Error message',
      'Please enter an age between 18 and 90.',
      'error',
    );

    return;
  }

  const person = {
    Name: form.querySelector('input[name="name"]').value,
    Position: form.querySelector('input[name="position"]').value,
    Office: form.querySelector('select[name="office"]').value,
    Age: form.querySelector('input[name="age"]').value,
    Salary:
      '$' +
      Number(form.querySelector('input[name="salary"]').value).toLocaleString(
        'en-US',
      ),
  };
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${person.Name}</td>
    <td>${person.Position}</td>
    <td>${person.Office}</td>
    <td>${person.Age}</td>
    <td>${person.Salary}</td>
  `;

  tableBody.appendChild(row);

  pushNotification(
    'Success message',
    'New employee added to the table.',
    'success',
  );
  form.reset();
});
