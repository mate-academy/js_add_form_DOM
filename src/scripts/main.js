'use strict';

const thead = document.querySelector('thead');
const mainColumn = thead.querySelector('tr');
const tBody = document.querySelector('tbody');
const tBodyRows = tBody.rows;
let rowsArray = Array.from(tBodyRows);

let sortingOrder = null;
let currentColumn = null;

function toNumber(stringWithSymbols) {
  return parseFloat(stringWithSymbols.replace(/[$,]/g, ''));
}

function sortRow(rowToSort) {
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  rowToSort.forEach(row => {
    tBody.appendChild(row);
  });
}

function sortAscDesc(index) {
  if (currentColumn !== index) {
    sortingOrder = 'asc';
  } else {
    sortingOrder = sortingOrder === 'asc' ? 'desc' : 'asc';
  }

  currentColumn = index;
}

thead.addEventListener('click', e => {
  const target = e.target;

  for (let i = 0; i < mainColumn.children.length; i++) {
    let sortedRows;

    if (target === mainColumn.children[i] && i > 2) {
      sortAscDesc(i);

      sortedRows = rowsArray.sort((a, b) => {
        const numA = toNumber(a.cells[i].innerText);
        const numB = toNumber(b.cells[i].innerText);

        return sortingOrder === 'asc' ? numA - numB : numB - numA;
      });
      sortRow(sortedRows);
    }

    if (target === mainColumn.children[i] && i <= 2) {
      sortAscDesc(i);

      sortedRows = rowsArray.sort((a, b) => {
        const nameA = a.cells[i].innerText.toLowerCase();
        const nameB = b.cells[i].innerText.toLowerCase();

        return sortingOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });

      sortRow(sortedRows);
    }

    rowsArray.forEach((element) => element.classList.remove('active'));
  }
}
);

tBody.addEventListener('click', e => {
  const target = e.target;

  if (target.tagName === 'TD') {
    rowsArray.forEach((element) => element.classList.remove('active'));
    target.parentElement.classList.add('active');
  }

  rowsArray = Array.from(tBodyRows);
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML
= '<label>Name: <input name="name" type="text" data-qa="name"></label>'
+ '<label>Position: <input name="position" type="text" data-qa="position">'
+ '</label>'
+ '<label>Office:'
+ '<select name="office" data-qa="office">'
+ '<option></option>'
+ '<option value="Tokyo">Tokyo</option>'
+ '<option value="Singapore">Singapore</option>'
+ '<option value="London">London</option>'
+ '<option value="New York">New York</option>'
+ '<option value="Edinburgh">Edinburgh</option>'
+ '<option value="San Francisco">San Francisco</option>'
+ '</select>'
+ '</label>'
+ '<label>Age: <input name="age" type="number" data-qa="age"></label>'
+ '<label>Salary: <input name="salary" type="number" data-qa="salary"></label>'
+ '<button>Save to table</button>';

document.body.appendChild(form);

const fieldValues = form.querySelectorAll('[data-qa]');
const fieldsArray = [...fieldValues];

form.addEventListener('click', e => {
  const target = e.target;
  const button = form.querySelector('button');

  if (target === button) {
    e.preventDefault();

    const newRow = tBody.insertRow(tBody);
    const fields = {
      name: fieldsArray[0].value,
      position: fieldsArray[1].value,
      office: fieldsArray[2].value,
      age: fieldsArray[3].value,
      salary: fieldsArray[4].value,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (!value.length) {
        pushNotification('Error',
          'Fill all lines',
          'error');

        return;
      }

      if (key === 'name' && value.length < 4) {
        pushNotification('Name is too short',
          'Name has to be at least 4 characters',
          'error');

        return;
      }

      if (key === 'age' && (value < 18 || value > 90)) {
        pushNotification('Wrong age',
          'Age has to be between 18 and 60 years',
          'error');

        return;
      }
    }

    fieldsArray.forEach((field) => {
      const cell = newRow.insertCell();

      if (field.name === 'salary') {
        const formattedSalary
        = '$' + field.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        cell.innerText = formattedSalary;
      } else {
        cell.innerText = field.value;
      }
    });

    pushNotification('Hooray!',
      'New employee is successfully added to the table',
      'success');

    rowsArray = Array.from(tBodyRows);
    form.reset();
  }
}
);

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');

  switch (type) {
    case 'success':
      notification.classList.add('success');
      break;
    case 'error':
      notification.classList.add('error');
      break;
  }

  notification.style.top = `15px`;
  notification.style.right = `15px`;

  const titleContext = document.createElement('h2');

  titleContext.classList.add('title');

  const descriptionContext = document.createElement('p');

  titleContext.innerText = title;
  descriptionContext.innerText = description;

  notification.appendChild(titleContext);
  notification.appendChild(descriptionContext);
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
};

tBody.addEventListener('dblclick', e => {
  const target = e.target;

  if (target.tagName === 'TD') {
    const parentRow = target.parentElement;

    const originalText = target.innerText;
    const newInput = document.createElement('INPUT');

    const handleInput = function() {
      if (newInput.value.trim() === '') {
        target.innerText = originalText;
      } else {
        target.innerText = newInput.value;
      }

      if (newInput.classList.contains('salary')) {
        target.innerText
          = '$' + newInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    };

    target.innerText = '';
    newInput.classList.add('cell-input');

    newInput.value = originalText;

    if (target === parentRow.children[3]) {
      newInput.setAttribute('type', 'number');
    }

    if (target === parentRow.children[4]) {
      newInput.value = Number(originalText.replace(/\D/g, ''));
      newInput.setAttribute('type', 'number');
      newInput.classList.add('salary');
    }

    target.appendChild(newInput);
    newInput.focus();

    newInput.addEventListener('blur', () => {
      handleInput();
    });

    newInput.addEventListener('keypress', (press) => {
      if (press.key === 'Enter') {
        handleInput();
      }
    });
  }
});
