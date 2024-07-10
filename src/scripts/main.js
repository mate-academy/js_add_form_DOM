'use strict';

const tableElement = document.querySelector('table');
let sortedValue = '';

tableElement.addEventListener('click', (e) => {
  const bodyElement = document.querySelector('tbody');
  const bodyRows = [...bodyElement.rows];
  const newBodyElement = document.createElement('tbody');
  const headElement = e.target.closest('thead');
  let sortedData = [];

  if (headElement) {
    const data = bodyRows.map((trElement) => {
      const newObject = {
        name: trElement.cells[0].textContent,
        position: trElement.cells[1].textContent,
        office: trElement.cells[2].textContent,
        age: trElement.cells[3].textContent,
        salary: trElement.cells[4].textContent,
      };

      return newObject;
    });

    bodyElement.remove();
    tableElement.tHead.after(newBodyElement);

    switch (e.target.textContent) {
      case 'Name': {
        sortedData = [...data].sort((el1, el2) => {
          return el1.name.toLowerCase().localeCompare(el2.name.toLowerCase());
        });

        if (sortedValue === 'Name') {
          sortedData.reverse();

          sortedValue = '';
          break;
        }

        sortedValue = e.target.textContent;

        break;
      }

      case 'Position': {
        sortedData = [...data].sort((el1, el2) => {
          return el1.position
            .toLowerCase()
            .localeCompare(el2.position.toLowerCase());
        });

        if (sortedValue === 'Position') {
          sortedData.reverse();

          sortedValue = '';
          break;
        }

        sortedValue = e.target.textContent;

        break;
      }

      case 'Office': {
        sortedData = [...data].sort((el1, el2) => {
          return el1.office
            .toLowerCase()
            .localeCompare(el2.office.toLowerCase());
        });

        if (sortedValue === 'Office') {
          sortedData.reverse();

          sortedValue = '';

          break;
        }

        sortedValue = e.target.textContent;

        break;
      }

      case 'Age': {
        sortedData = [...data].sort((el1, el2) => +el1.age - +el2.age);

        if (sortedValue === 'Age') {
          sortedData.reverse();

          sortedValue = '';

          break;
        }

        sortedValue = e.target.textContent;

        break;
      }

      case 'Salary': {
        sortedData = [...data].sort(
          (el1, el2) =>
            +el1.salary.slice(1).split(',').join('') -
            +el2.salary.slice(1).split(',').join(''),
        );

        if (sortedValue === 'Salary') {
          sortedData.reverse();

          sortedValue = '';

          break;
        }

        sortedValue = e.target.textContent;

        break;
      }

      default: {
        sortedData = [...data];
      }
    }

    const newElements = sortedData.map((el) => {
      const trElement = document.createElement('tr');

      for (const property in el) {
        const thElement = document.createElement('td');

        thElement.textContent = el[property];
        trElement.append(thElement);
      }

      return trElement;
    });

    newElements.forEach((corEl) => {
      newBodyElement.append(corEl);
    });
  }
});

document.querySelectorAll('tbody tr').forEach((tr) => {
  tr.addEventListener('click', () => {
    document.querySelectorAll('tbody tr').forEach((row) => {
      row.classList.remove('active');
    });

    tr.classList.add('active');
  });
});

document.querySelectorAll('td').forEach((td) => {
  td.addEventListener('dblclick', () => {
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = td.textContent;
    input.defaultValue = td.textContent;
    td.textContent = '';
    td.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      td.textContent = input.value || input.defaultValue;
      input.remove();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        td.textContent = input.value || input.defaultValue;
        input.remove();
      }
    });
  });
});

const formElement = document.createElement('form');

formElement.className = 'new-employee-form';

formElement.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
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
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
  `;

document.body.append(formElement);

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(formElement);
  const trElement = document.createElement('tr');

  for (const [key, value] of data) {
    if (key === 'name' && value.length < 4) {
      pushNotification(key, value);

      return;
    }

    if (!value) {
      pushNotification(key, value);

      return;
    }

    if (key === 'age' && (value < 18 || value > 90)) {
      pushNotification(key, value);

      return;
    }

    const tdElement = document.createElement('td');

    tdElement.textContent = value;

    if (key === 'salary' && value > 0) {
      const newValue = +value;

      tdElement.textContent = `$${newValue.toLocaleString('en-US')}`;
    }

    trElement.append(tdElement);
  }

  pushNotification('great');

  tableElement.tBodies[0].append(trElement);
});

const pushNotification = (key, value) => {
  const divElement = document.createElement('div');
  const h2Element = document.createElement('h2');
  const pElement = document.createElement('p');

  divElement.setAttribute('data-qa', 'notification');
  h2Element.classList.add('title');

  switch (key) {
    case 'name': {
      divElement.classList.add('notification', 'error');
      h2Element.textContent = 'Title of Error message';

      pElement.textContent =
        'The "name" field must contain at least 4 characters.';

      break;
    }

    case 'age': {
      divElement.classList.add('notification', 'error');
      h2Element.textContent = 'Title of Error message';

      if (value < 18) {
        pElement.textContent = 'You must be at least 18 years old.';
        break;
      }

      if (value > 90) {
        pElement.textContent = 'You are too old';
        break;
      }

      pElement.textContent = 'The "age" field must not be empty.';
      break;
    }

    case 'great': {
      divElement.classList.add('notification', 'success');
      h2Element.textContent = 'Title of Success message';
      pElement.textContent = 'Data has been successfully added to the table!';
      break;
    }

    default: {
      divElement.classList.add('notification', 'error');
      h2Element.textContent = 'Title of Error message';
      pElement.textContent = `The "${key}" field must not be empty.`;
      break;
    }
  }

  divElement.prepend(h2Element);
  divElement.append(pElement);
  divElement.style.top = '450px';
  divElement.style.right = '10px';

  document.body.append(divElement);

  setTimeout(() => (divElement.style.visibility = 'hidden'), 2000);
};
