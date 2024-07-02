'use strict';

const page = document.querySelector('body');
const tableHead = document.querySelector('thead');
const tableHeadCollection = tableHead.querySelectorAll('th');
const tableContent = document.querySelector('tbody');

let sortingIndex = null;

function sortTable(columnIndex) {
  let shouldSwitch = false;
  let switching = true;

  while (switching) {
    let i = 0;
    const rows = tableContent.rows;

    switching = false;

    if (sortingIndex !== columnIndex) {
      for (i = 0; i < rows.length - 1; i++) {
        shouldSwitch = false;

        const row1 = rows[i].getElementsByTagName('td')[columnIndex];
        const row2 = rows[i + 1].getElementsByTagName('td')[columnIndex];

        if (columnIndex === 4) {
          if (
            +row1.innerHTML.slice(1).replaceAll(',', '') >
            +row2.innerHTML.slice(1).replaceAll(',', '')
          ) {
            shouldSwitch = true;
            break;
          }
        } else if (
          row1.innerHTML.toLowerCase() > row2.innerHTML.toLowerCase()
        ) {
          shouldSwitch = true;
          break;
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    } else {
      for (i = 0; i < rows.length - 1; i++) {
        shouldSwitch = false;

        const row1 = rows[i].getElementsByTagName('td')[columnIndex];
        const row2 = rows[i + 1].getElementsByTagName('td')[columnIndex];

        if (columnIndex === 4) {
          if (
            +row1.innerHTML.slice(1).replaceAll(',', '') <
            +row2.innerHTML.slice(1).replaceAll(',', '')
          ) {
            shouldSwitch = true;
            break;
          }
        } else if (
          row1.innerHTML.toLowerCase() < row2.innerHTML.toLowerCase()
        ) {
          shouldSwitch = true;
          break;
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

  if (sortingIndex === columnIndex) {
    sortingIndex = null;
  } else {
    sortingIndex = columnIndex;
  }
}

tableHeadCollection.forEach((headItem) => {
  headItem.addEventListener('click', (e) => {
    switch (e.currentTarget.textContent) {
      case 'Name':
        sortTable(0);
        break;
      case 'Position':
        sortTable(1);
        break;
      case 'Office':
        sortTable(2);
        break;
      case 'Age':
        sortTable(3);
        break;
      case 'Salary':
        sortTable(4);
        break;
    }
  });
});

const setActiveClass = () => {
  const tableRows = tableContent.querySelectorAll('tr');

  tableRows.forEach((row) => {
    row.addEventListener('click', (e) => {
      const oldActive = tableContent.querySelector('.active');

      if (oldActive) {
        oldActive.classList.remove('active');
      }

      e.currentTarget.classList.add('active');
    });
  });
};

const newEmployeeForm = document.createElement('form');

newEmployeeForm.setAttribute('onsubmit', `return event.preventDefault()`);
newEmployeeForm.classList.add('new-employee-form');
page.append(newEmployeeForm);

const nameLabel = document.createElement('label');
const positionLabel = document.createElement('label');
const officeLabel = document.createElement('label');
const ageLabel = document.createElement('label');
const salaryLabel = document.createElement('label');

nameLabel.textContent = 'Name:';
positionLabel.textContent = 'Position:';
officeLabel.textContent = 'Office:';
ageLabel.textContent = 'Age:';
salaryLabel.textContent = 'Salary:';

newEmployeeForm.append(
  nameLabel,
  positionLabel,
  officeLabel,
  ageLabel,
  salaryLabel,
);

const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const officeSelect = document.createElement('select');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');
const submitButton = document.createElement('button');

nameInput.setAttribute('name', 'name');
nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameLabel.append(nameInput);

positionInput.setAttribute('name', 'position');
positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionLabel.append(positionInput);

const officeOption1 = document.createElement('option');
const officeOption2 = document.createElement('option');
const officeOption3 = document.createElement('option');
const officeOption4 = document.createElement('option');
const officeOption5 = document.createElement('option');
const officeOption6 = document.createElement('option');

officeSelect.setAttribute('name', 'office');
officeSelect.setAttribute('data-qa', 'office');
officeSelect.required = true;
officeOption1.value = 'Edinburgh';
officeOption1.textContent = 'Edinburgh';
officeOption2.value = 'London';
officeOption2.textContent = 'London';
officeOption3.value = 'New York';
officeOption3.textContent = 'New York';
officeOption4.value = 'San Francisco';
officeOption4.textContent = 'San Francisco';
officeOption5.value = 'Singapore';
officeOption5.textContent = 'Singapore';
officeOption6.value = 'Tokyo';
officeOption6.textContent = 'Tokyo';

officeSelect.append(
  officeOption1,
  officeOption2,
  officeOption3,
  officeOption4,
  officeOption5,
  officeOption6,
);

officeLabel.append(officeSelect);

ageInput.setAttribute('name', 'age');
ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageLabel.append(ageInput);

salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('data-qa', 'salary');
salaryLabel.append(salaryInput);

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
newEmployeeForm.append(submitButton);

function showNotify(text, type) {
  const notification = document.createElement('div');
  const notificationMessage = document.createElement('span');

  notificationMessage.setAttribute('class', 'title');
  notification.setAttribute('class', 'notification');
  notification.setAttribute('data-qa', 'notification');
  notification.style.display = 'flex';
  notification.style.justifyContent = 'center';
  notification.style.alignItems = 'center';
  notification.style.textAlign = 'center';
  notificationMessage.textContent = text;

  if (type === 'error') {
    notification.classList.add('error');
  } else {
    notification.classList.add('success');
  }

  notification.append(notificationMessage);
  page.append(notification);

  setTimeout(() => notification.remove(), 5000);
}

submitButton.addEventListener('click', () => addNewEmployee());

const setEditableCells = () => {
  const editableCells = tableContent.querySelectorAll('td');

  editableCells.forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      const oldValue = cell.textContent;
      const valueInput = document.createElement('input');

      cell.childNodes[0].remove();
      cell.prepend(valueInput);
      valueInput.setAttribute('class', 'cell-input');
      valueInput.focus();

      valueInput.onblur = () => {
        if (!valueInput.value) {
          valueInput.remove();

          cell.textContent = oldValue;
        } else {
          cell.textContent = valueInput.value;

          valueInput.remove();
        }
      };

      valueInput.onkeydown = (e) => {
        if (e.key === 'Enter') {
          if (!valueInput.value) {
            valueInput.remove();

            cell.textContent = oldValue;
          } else {
            cell.textContent = valueInput.value;

            valueInput.remove();
          }
        }
      };
    });
  });
};

function addNewEmployee() {
  const warning = [];

  if (nameInput.value.length < 4) {
    warning.push('Name should be at least 4 symbols length.');
  }

  if (!positionInput.value) {
    warning.push('Position field should be filled.');
  }

  if (!salaryInput.value) {
    warning.push('Salary field should be filled.');
  }

  if (+salaryInput.value < 0) {
    warning.push('Salary field should be with a positive number.');
  }

  if (+ageInput.value < 18 || +ageInput.value > 90) {
    warning.push('Age should be between 18 and 90 y.o.');
  }

  if (warning.length > 0) {
    return showNotify(warning.join('\n'), 'error');
  }

  const newRow = document.createElement('tr');
  const newName = document.createElement('td');
  const newPosition = document.createElement('td');
  const newOffice = document.createElement('td');
  const newAge = document.createElement('td');
  const newSalary = document.createElement('td');

  newName.textContent = nameInput.value;
  newPosition.textContent = positionInput.value;
  newOffice.textContent = officeSelect.value;
  newAge.textContent = ageInput.value;
  newSalary.textContent = '$' + (+salaryInput.value).toLocaleString('en-US');

  newRow.append(newName, newPosition, newOffice, newAge, newSalary);
  tableContent.append(newRow);

  nameInput.value = '';
  positionInput.value = '';
  officeSelect.value = officeOption1.value;
  ageInput.value = '';
  salaryInput.value = '';

  setEditableCells();
  setActiveClass();

  return showNotify('Employee successfully added.', 'success');
}

setActiveClass();
setEditableCells();
