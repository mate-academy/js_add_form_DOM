'use strict';

const tBody = document.querySelector('tbody');
const rows = [...tBody.querySelectorAll('tr')];

function sortTable(cellIndex, type = 'text', order = true) {
  rows.sort((a, b) => {
    let characteristicA = a.querySelectorAll('td')[cellIndex].textContent;
    let characteristicB = b.querySelectorAll('td')[cellIndex].textContent;
    let comparison;

    switch (type) {
      case 'text':
        comparison = characteristicA.localeCompare(characteristicB);
        break;
      case 'number':
        comparison = characteristicA - characteristicB;
        break;
      case 'money':
        characteristicA = parseFloat(characteristicA.replace(/[^0-9.]/g, ''));
        characteristicB = parseFloat(characteristicB.replace(/[^0-9.]/g, ''));
        comparison = characteristicA - characteristicB;
        break;
      default:
        comparison = 0;
        break;
    }

    return order ? comparison : -comparison;
  });

  rows.forEach((row) => tBody.appendChild(row));
}

function addSortEventListener(selector, index, type) {
  document.querySelector(selector).addEventListener('click', (e) => {
    const salarySortElement = document.querySelector(selector);
    const currentDirection = salarySortElement.getAttribute('direction');

    if (!currentDirection || currentDirection === 'false') {
      sortTable(index, type);
      salarySortElement.setAttribute('direction', 'true');
    } else {
      sortTable(index, type, false);
      salarySortElement.setAttribute('direction', 'false');
    }
  });
}

addSortEventListener('#nameSort', 0, 'text');
addSortEventListener('#positionSort', 1, 'text');
addSortEventListener('#officeSort', 2, 'text');
addSortEventListener('#ageSort', 3, 'number');
addSortEventListener('#salarySort', 4, 'money');

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<h2 class='title'>${title}</h2><p>${description}</p>`;
  notification.classList.add('notification', type);
  document.body.append(notification);
  setTimeout(() => (notification.style.visibility = 'hidden'), 2000);
};

function CreateCell(content) {
  const cell = document.createElement('td');

  cell.textContent = content;

  return cell;
}

const addRow = (namevalue, position, office, age, salary) => {
  const row = document.createElement('tr');

  row.append(
    CreateCell(namevalue),
    CreateCell(position),
    CreateCell(office),
    CreateCell(age),
    CreateCell(salary),
  );
  document.querySelector('tbody').append(row);
};

document.getElementById('saveButton').addEventListener('click', (e) => {
  e.preventDefault();

  const namevalue = document.querySelector('[name="name"]').value;
  const position = document.querySelector('[name="position"]').value;
  const office = document.querySelector('[name="office"]').value;
  const age = document.querySelector('[name="age"]').value;
  const salary =
    '$' +
    Number(document.querySelector('[name="salary"]').value).toLocaleString(
      'en-US',
    );

  if (namevalue.length < 4) {
    pushNotification(
      'Name is too short',
      'Name must contain more then 3 letters',
      'error',
    );

    return;
  } else if (position.length < 4) {
    pushNotification(
      'Position is too short',
      'Position must contain more then 3 letters',
      'error',
    );

    return;
  } else if (age < 18 || age > 90) {
    pushNotification(
      'Age is invalid',
      'Age value must be between 18 and 90',
      'error',
    );

    return;
  }

  const rowsN = document.getElementsByTagName('tr').length;

  addRow(namevalue, position, office, age, salary);

  if (rowsN < document.getElementsByTagName('tr').length) {
    pushNotification('Success', 'Information was added', 'success');
    document.querySelector('[name="name"]').value = '';
    document.querySelector('[name="position"]').value = '';
    document.querySelector('[name="office"]').value = 'Tokyo';
    document.querySelector('[name="age"]').value = '';
    document.querySelector('[name="salary"]').value = '';
  } else {
    pushNotification('Error', 'Something went wrong', 'error');
  }
});

document.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', function () {
    document
      .querySelectorAll('tbody tr')
      .forEach((r) => r.classList.remove('active'));
    this.classList.add('active');
  });
});
