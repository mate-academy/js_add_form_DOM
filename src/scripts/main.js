'use strict';

const head = document.querySelector('thead');
const body = document.querySelector('tbody');
const root = document.querySelector('body');
let inOrder = true;

// Sort table
head.addEventListener('click', e => {
  const index = e.target.closest('th').cellIndex;
  const rows = [...body.rows];

  const sortTable = rows.sort((a, b) => {
    const valueA = a.cells[index].innerText.replace(/[$,]/g, '');
    const valueB = b.cells[index].innerText.replace(/[$,]/g, '');

    if (inOrder === true) {
      if (isNaN(valueA)) {
        return valueA.localeCompare(valueB);
      } else {
        return valueA - valueB;
      }
    }

    if (isNaN(valueA)) {
      return valueB.localeCompare(valueA);
    } else {
      return valueB - valueA;
    };
  });

  inOrder = !inOrder;
  body.append(...sortTable);
});

// Select row in table
body.addEventListener('click', e => {
  const panels = body.querySelectorAll('tr');
  const actives = body.querySelectorAll('.active');

  for (let i = 0; panels.length > i; i++) {
    panels[i].onclick = function() {
      const currentActive = actives[0];

      if (currentActive) {
        currentActive.classList.remove('active');
      }

      if (currentActive !== this) {
        this.classList.add('active');
      }
    };
  }
});

// Double click on cell
body.addEventListener('dblclick', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const target = e.target;
  const input = document.createElement('input');
  const originData = target.innerText;

  input.classList.add('cell-input');
  input.type = 'text';
  target.innerText = '';
  target.append(input);
  input.focus();

  function saveData(value = originData, key) {
    target.innerText = value;
    input.remove();
  }

  function validData() {
    if (!input.value) {
      saveData();

      return;
    }

    if ((target.cellIndex === 3 || target.cellIndex === 4)
      && !input.value.match(/[0-9]/)) {
      saveData();

      return;
    }

    if (target.cellIndex === 4 && input.value.match(/[0-9]/)) {
      saveData(`$` + (+input.value).toLocaleString('en-US'));

      return;
    }

    if ((target.cellIndex === 3) && (input.value < 18 || input.value > 90)) {
      saveData();

      return;
    }

    if (target.cellIndex === 2) {
      e.target.insertAdjacentHTML('beforeend', `
       
          <select name="office" data-qa="office">
            <option value="Tokyo">Tokyo</option>
            <option value="Singapore">Singapore</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="San Francisco">San Francisco</option>
          </select>
        
    `);

      input.remove();

      return;
    }
    saveData(input.value);
  }

  input.onblur = () => {
    validData();
  };

  input.onkeydown = (keyboardEvent) => {
    const enter = keyboardEvent.code === 'Enter';

    if (enter) {
      saveData();
    }
  };
});

// Create a form
root.insertAdjacentHTML('beforeend', `
  <form
    action="#"
    method="get"
    class="new-employee-form"
  >
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>
    <label>Position:
      <input name="position" type="text" data-qa="position">
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
      <input
        name="age"
        type="number"
        data-qa="age"
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
      >
    </label>
    <button type="submit">Save to table</button>
  </form>
`);

// Show notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const textTitle = document.createElement('h2');
  const textParagraph = document.createElement('p');
  const textBody = document.createElement('div');

  textBody.className = `notification notification.title.${type}`;
  textBody.style.boxSizing = 'content-box';
  textBody.style.top = posTop + 'px';
  textBody.style.right = posRight + 'px';
  textBody.dataset.qa = 'notification';
  document.body.append(textBody);

  textTitle.className = 'notification.title';
  textTitle.textContent = title;
  textBody.append(textTitle);

  textParagraph.textContent = description;
  textBody.append(textParagraph);

  setTimeout(() => textBody.remove(), 2000);
};

// Create button click
const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const valueName = data.get('name');
  const valuePosition = data.get('position');
  const valueOffice = data.get('office');
  const valueAge = data.get('age');
  const valueSalary = data.get('salary');

  if ((!valuePosition) || (!valueSalary) || (!valueName) || (!valueAge)) {
    pushNotification(10, 10, 'Error!!!',
      'You have to fill all places.', 'error');
  } else
  if (valueName.length < 4) {
    pushNotification(120, 10, 'Error!!!',
      'You have to fill all places.', 'error');

    pushNotification(10, 10, 'Error!!!',
      'You name must be more 4!', 'error');
  } else
  if (valueAge > 90) {
    pushNotification(120, 10, 'Error!!!',
      'You have to fill all places.', 'error');

    pushNotification(10, 10, 'Error!!!',
      'You age must be less 90!', 'error');
  } else
  if (valueAge < 18) {
    pushNotification(120, 10, 'Error!!!',
      'You have to fill all places.', 'error');

    pushNotification(10, 10, 'Error!!!',
      'You age must be more 18!', 'error');
  } else {
    body.insertAdjacentHTML(`beforeend`, `
    <tr>
      <td>${valueName}</td>
      <td>${valuePosition}</td>
      <td>${valueOffice}</td>
      <td>${valueAge}</td>
      <td>$${valueSalary},000</td>
    </tr>
  `);

    pushNotification(10, 10, 'Success!!!',
      'You add a row.', 'success');
    form.reset();
  }
});
