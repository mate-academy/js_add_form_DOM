'use strict';

const headTable = document.querySelector('thead');
const bodyTable = document.querySelector('tbody');
const rows = [...bodyTable.rows];
let sortedList;

headTable.addEventListener('click', e => {
  const rowsAll = [...bodyTable.rows];

  const header = e.target.closest('th');
  const index = header.cellIndex;

  function numberOptimizer(str) {
    return str.replace(/[$,]/g, '');
  };

  rows.sort((a, b) => {
    const rowOne = numberOptimizer(a.cells[index].textContent);
    const rowTwo = numberOptimizer(b.cells[index].textContent);

    if (Number.isNaN(+rowOne)) {
      return rowOne.localeCompare(rowTwo);
    }

    return +rowOne - Number(rowTwo);
  });

  if (sortedList !== header) {
    bodyTable.append(...rowsAll);
    sortedList = header;
  } else {
    bodyTable.append(...rowsAll.reverse());
    sortedList = null;
  }
});

bodyTable.addEventListener('click', e => {
  rows.forEach(item => item.classList.remove('active'));
  e.target.parentNode.classList.toggle('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
      >
  </label>
  <label>
    Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      >
  </label>
  <label>
    Office:
      <select
        name="office"
        data-qa="office"
        required
      >
        <option value="Tokyo">
          Tokyo
        </option>
        <option value="Singapore">
          Singapore
        </option>
        <option value="London">
          London
        </option>
        <option value="New York">
          New York
        </option>
        <option value="Edinburgh">
          Edinburgh
        </option>
        <option value="San Francisco">
          San Francisco
        </option>
    </select>
  </label>
  <label>
    Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        required
      >
  </label>
  <label>
    Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      >
  </label>
  <button type="submit">Save to table</button>
`;

document.body.append(form);

const pushNotification = (title, description, type) => {
  const messageBlock = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  messageBlock.setAttribute('data-qa', 'notification');
  messageBlock.classList.add('notification', type);

  messageTitle.className = 'title';
  messageTitle.textContent = title;

  messageDescription.className = 'description';
  messageDescription.textContent = description;

  messageBlock.append(messageTitle, messageDescription);
  document.querySelector('body').append(messageBlock);

  setTimeout(() => {
    messageBlock.remove();
  }, 5000
  );
};

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObj = Object.fromEntries(data.entries());

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${dataObj.name}</td>
    <td>${dataObj.position}</td>
    <td>${dataObj.office}</td>
    <td>${dataObj.age}</td>
    <td>$${Number(dataObj.salary).toLocaleString('en-US')}</td>
  `;

  if (dataObj.name.length < 4) {
    pushNotification(
      'Error',
      'Name must include at least 4 letters',
      'error');
  } else if (Number(dataObj.age) < 18 || Number(dataObj.age) > 90) {
    pushNotification(
      'Error',
      'Age must be no less than 18 and no more than 90',
      'error');
  } else {
    pushNotification(
      'Success',
      'Employee is successfully added to the table',
      'success');

    bodyTable.append(newRow);
    form.reset();
  }
});

bodyTable.addEventListener('dblclick', (e) => {
  const target = e.target;

  const textEvent = target.textContent;
  const indexEvent = target.cellIndex;

  target.textContent = '';

  let inputNew = document.createElement('input');

  inputNew.classList.add('cell-input');

  if (indexEvent === 2) {
    const selectNew = document.createElement('select');
    const locations = [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ];

    for (const place of locations) {
      const city = document.createElement('option');

      city.textContent = place;
      selectNew.append(city);
    };

    inputNew = selectNew;
  }

  target.append(inputNew);
  inputNew.focus();

  inputNew.addEventListener('blur', () => {
    switch (indexEvent) {
      case 0:
        if (inputNew.value.length < 4) {
          pushNotification('Erroe', 'Name must include at least 4 letters');
          target.textContent = textEvent;
        } else {
          target.textContent = inputNew.value;
        }

        break;

      case 1:
        if (inputNew.value) {
          target.textContent = inputNew.value;
        } else {
          target.textContent = textEvent;
        }
        break;

      case 2:
        if (inputNew.value) {
          target.textContent = inputNew.value;
        } else {
          target.textContent = textEvent;
        }
        break;

      case 3:
        if (inputNew.value < 18 || inputNew.value > 90) {
          pushNotification(
            'Erroe', 'Age must be no less than 18 and no more than 90'
          );
          target.textContent = textEvent;
        } else {
          target.textContent = inputNew.value;
        }
        break;

      case 4:
        if (inputNew.value) {
          target.textContent
            = '$' + Number(inputNew.value).toLocaleString('en-US');
        } else {
          target.textContent = textEvent;
        }
        break;
    }

    inputNew.remove();
  });

  inputNew.addEventListener('keydown', e1 => {
    if (e1.key === 'Enter') {
      inputNew.blur();
    }
  });
});
