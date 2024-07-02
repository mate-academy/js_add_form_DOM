'use strict';

const table = document.querySelector('table');
const thead = table.tHead;
const tbody = table.tBodies[0];
const employees = tbody.rows;

let reverse = false;
let prevTitle = null;
let timeoutId = null;

document.body.insertAdjacentHTML(
  'beforeend',
  `
  <form
    action="/"
    method="post"
    class="new-employee-form"
  >
    <label>
      Name:
      <input
        data-qa="name"
        name="name"
        type="text"
        pattern="[a-zA-Z0-9_]+"
        required
      >
    </label>

    <label>
      Position:
      <input
        data-qa="position"
        name="position"
        type="text"
        pattern="[a-zA-Z0-9_]+"
        required
      >
    </label>

    <label>
      Office:
      <select data-qa="office" name="office">
        <option value="Tokyo" selected>Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>
      Age:
      <input
        data-qa="age"
        name="age"
        type="number"
        required
      >
    </label>

    <label>
      Salary:
      <input
        data-qa="salary"
        name="salary"
        type="number"
        required
      >
    </label>

    <button type="submit">Save to table</button>
  </form>
`,
);

const form = document.querySelector('form');
const submitButton = form.querySelector('button');

submitButton.addEventListener('click', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const formName = data.get('name');
  const formPosition = data.get('position');
  const formOffice = data.get('office');
  const formAge = +data.get('age');
  const formSalary = +data.get('salary');

  if (!formName.trim()) {
    pushNotification('Name Error', 'Name cannot be empty.', 'error');

    return;
  }

  if (formName.trim().length < 4) {
    pushNotification(
      'Name Error',
      'Name cannot be less than 4 symbols.',
      'error',
    );

    return;
  }

  if (!formPosition.trim()) {
    pushNotification('Position Error', 'Position cannot be empty.', 'error');

    return;
  }

  if (!formAge) {
    pushNotification('Age Error', 'Please enter the age.', 'error');

    return;
  }

  if (formAge < 18 || formAge > 90) {
    pushNotification(
      'Age Error',
      'Age cannot be less than 18 or more than 90.',
      'error',
    );

    return;
  }

  if (!formSalary) {
    pushNotification('Salary Error', 'Please enter the salary.', 'error');

    return;
  }

  if (formSalary < 0) {
    pushNotification('Salary Error', 'Salary cannot be less than 0.', 'error');

    return;
  }

  tbody.insertAdjacentHTML(
    'beforeend',
    `
      <tr>
        <td>${formName}</td>
        <td>${formPosition}</td>
        <td>${formOffice}</td>
        <td>${formAge}</td>
        <td>$${formSalary.toLocaleString('en-US')}</td>
      </tr>
    `,
  );

  form.elements.name.value = '';
  form.elements.position.value = '';
  form.elements.office.value = 'Tokyo';
  form.elements.age.value = '';
  form.elements.salary.value = '';

  pushNotification(
    'Success',
    'New employee successfully added to the table.',
    'success',
  );
});

thead.addEventListener('click', (e) => {
  const th = e.target;
  const title = th.innerText;

  if (prevTitle !== title) {
    reverse = false;
  }

  prevTitle = title;

  const sortedEmployees = sort(employees, title, reverse);

  reverse = !reverse;

  sortedEmployees.forEach((employee) => {
    tbody.append(employee);
  });
});

tbody.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tr');
  const rows = tbody.rows;

  for (const row of rows) {
    row.classList.remove('active');
  }

  selectedRow.className = 'active';
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target;
  const tdStyle = getComputedStyle(td);
  const width = tdStyle.width;
  const cacheText = td.innerText;

  td.innerText = '';

  const input = document.createElement('input');

  td.append(input);

  input.classList.add('cell-input');
  input.style.width = width;
  input.focus();
  input.value = cacheText;

  input.addEventListener('blur', () => {
    td.innerText = !input.value ? cacheText : input.value;
    input.remove();
  });

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      td.innerText = !input.value ? cacheText : input.value;
      input.remove();
    }
  });
});

function pushNotification(title, description, type) {
  const prevNotification = document.querySelector('.notification');

  if (prevNotification) {
    window.clearInterval(timeoutId);

    prevNotification.remove();
  }

  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <div
      data-qa="notification"
      class="notification ${type}"
    >
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `,
  );

  timeoutId = window.setTimeout(() => {
    const currentNotification = document.querySelector('.notification');

    currentNotification.remove();
  }, 3000);
}

function sort(people, query, isReverse) {
  const sortedPeople = [...people];

  switch (query) {
    case 'Name':
      return sortedPeople.sort((person1, person2) => {
        const name1 = person1.cells[0].innerText;
        const name2 = person2.cells[0].innerText;

        if (isReverse) {
          return name2.localeCompare(name1);
        }

        return name1.localeCompare(name2);
      });

    case 'Position':
      return sortedPeople.sort((person1, person2) => {
        const position1 = person1.cells[1].innerText;
        const position2 = person2.cells[1].innerText;

        if (isReverse) {
          return position2.localeCompare(position1);
        }

        return position1.localeCompare(position2);
      });

    case 'Office':
      return sortedPeople.sort((person1, person2) => {
        const office1 = person1.cells[2].innerText;
        const office2 = person2.cells[2].innerText;

        if (isReverse) {
          return office2.localeCompare(office1);
        }

        return office1.localeCompare(office2);
      });

    case 'Age':
      return sortedPeople.sort((person1, person2) => {
        const age1 = +person1.cells[3].innerText;
        const age2 = +person2.cells[3].innerText;

        if (isReverse) {
          return age2 - age1;
        }

        return age1 - age2;
      });

    case 'Salary':
      return sortedPeople.sort((person1, person2) => {
        const salaryText1 = person1.cells[4].innerText;
        const salaryText2 = person2.cells[4].innerText;

        const salary1 = +salaryText1.replace('$', '').replaceAll(',', '');
        const salary2 = +salaryText2.replace('$', '').replaceAll(',', '');

        if (isReverse) {
          return salary2 - salary1;
        }

        return salary1 - salary2;
      });

    default:
      return sortedPeople;
  }
}
