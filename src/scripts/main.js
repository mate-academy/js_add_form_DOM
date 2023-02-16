'use strict';

const tableHead = document.querySelector('thead');
const tableRow = document.querySelector('tbody');
const table = document.querySelector('table');
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

employeeForm.innerHTML = `
    <label>Name:
      <input type="text" name="name" data-qa="name">
    </label>
    <label>Position:
      <input type="text" name="position" data-qa="position">
    </label>
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
    <label>Age:
      <input type="number" name="age" data-qa="age">
    </label>
    <label>Salary:
      <input type="number" name="salary" data-qa="salary">
    </label>
    <button type="submit">Save to table</button>
`;

document.body.append(employeeForm);

tableHead.addEventListener('click', e => {
  const tableValue = [...tableRow.rows];
  const index = e.target.cellIndex;
  const sorted = sortTable(tableValue, index);
  const arrValid = [...table.tBodies[0].children].every((el, i) => {
    return sorted[i].innerHTML === el.innerHTML;
  });

  if (arrValid) {
    sorted.reverse();
    table.tBodies[0].append(...sorted);

    return;
  }
  table.tBodies[0].append(...sorted);
});

function sortTable(arr, index) {
  const sortArr = arr.sort((a, b) => {
    let copyA = a.cells[index].innerHTML;
    let copyB = b.cells[index].innerHTML;

    if (copyA[0] === '$') {
      copyA = +copyA.slice(1).split(',').join('');
      copyB = +copyB.slice(1).split(',').join('');

      return copyA - copyB;
    }

    if (+copyA) {
      return copyA - copyB;
    }

    return copyA.localeCompare(copyB);
  });

  return sortArr;
}

let oldParent;

tableRow.addEventListener('click', (e) => {
  if (oldParent) {
    oldParent.classList.remove('active');
    oldParent.removeAttribute('class');
  }
  oldParent = e.target.parentElement;
  e.target.parentElement.classList.add('active');
});

const form = document.querySelector('form');

function formValidate(data) {
  if (/[^a-z]/gi.test(data.get('name')) || data.get('name').length < 4) {
    pushNotification(
      'Name is not correct',
      'Your name must have at least 4 letters and must not include numbers',
      'error',
    );

    return false;
  }

  if (/[^a-z| ]/gi.test(data.get('position')) || data.get('position') === '') {
    pushNotification(
      'Position is not correct',
      'Position must not be empty and must not include numbers',
      'error',
    );

    return false;
  }

  if (data.get('age') < 18 || data.get('age') > 90) {
    pushNotification(
      'Age is not correct',
      'Your age cannot be less than 18 and more than 90',
      'error',
    );

    return false;
  }

  if (data.get('salary') === '' || data.get('salary') <= 0) {
    pushNotification(
      'Salary is not correct',
      'Salary must be greater than 0',
      'error',
    );

    return false;
  }

  return true;
}

const pushNotification = (title, description, type,
  posTop = 450, posRight = 280) => {
  const notification = document.createElement('div');
  const header = document.createElement('h2');
  const paragraph = document.createElement('p');

  notification.classList.value = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.append(header);
  notification.append(paragraph);

  header.textContent = title;
  header.classList.add('title');
  header.style.fontSize = '18px';

  paragraph.textContent = description;
  document.body.append(notification);
  setTimeout(() => notification.remove(), 3000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (formValidate(data)) {
    const newTableRow = tableRow.insertRow();
    let count = 0;

    data.set('salary', `$${Number(data.get('salary'))
      .toLocaleString('en-US')}`);

    data.forEach((el) => {
      newTableRow.insertCell(count).innerText = el;
      count++;
    });
    form.reset();

    pushNotification(
      'Validation success',
      'Employee was successfully added',
      'success',
    );
  }
});

tableRow.addEventListener('dblclick', (e) => {
  if (e.target.children.length > 0) {
    return;
  }

  const indexCell = e.target.cellIndex;
  let value = e.target.parentElement.cells[e.target.cellIndex].innerHTML;
  const createElement = form.elements[e.target.cellIndex].cloneNode(true);
  const cell = document.createElement('td');
  let eventState = false;

  cell.append(createElement);
  e.target.parentElement.cells[e.target.cellIndex].replaceWith(cell);
  createElement.focus();

  if (indexCell === 2) {
    for (const option of createElement.children) {
      if (option.value === value) {
        option.setAttribute('selected', '');
      }
    }
  }

  if (indexCell === 4) {
    value = value.slice(1).replaceAll(',', '');
  }

  createElement.setAttribute('value', value);

  createElement.addEventListener('keydown', (ev) => {
    const textInput = createElement.value;

    if (ev.code === 'Enter') {
      eventState = true;

      if (textInput.length === 0) {
        createElement.remove();
        cell.textContent = value;

        return;
      }

      switch (createElement.name) {
        case 'name':
          if (/[^a-z| ]/gi.test(textInput) || textInput.length < 4) {
            pushNotification(
              'Name is not correct',
              'Your name must have at least 4 '
              + 'letters and must not include numbers',
              'error',
            );
            break;
          }
          createElement.remove();
          cell.textContent = textInput;
          break;

        case 'position':
          if (/[^a-z| ]/gi.test(textInput)) {
            pushNotification(
              'Position is not correct',
              'Position must not be empty and must not include numbers',
              'error',
            );
            break;
          }
          createElement.remove();
          cell.textContent = textInput;
          break;
        case 'office':
          createElement.remove();
          cell.textContent = textInput;
          break;

        case 'age':
          if (textInput < 18 || textInput > 90) {
            pushNotification(
              'Age is not correct',
              'Your age cannot be less than 18 and more than 90',
              'error',
            );
            break;
          }
          createElement.remove();
          cell.textContent = textInput;
          break;

        case 'salary':
          if (textInput <= 0) {
            pushNotification(
              'Salary is not correct',
              'Salary must be greater than 0',
              'error',
            );
            break;
          }
          createElement.remove();
          cell.textContent = `$${Number(textInput).toLocaleString('en-US')}`;
          break;
      }
    }
  });

  createElement.addEventListener('blur', () => {
    if (eventState) {
      return;
    }
    createElement.remove();
    cell.textContent = createElement.value;
  });
});
