'use strict';

const table = document.querySelector('tbody');
const captions = document.querySelector('thead');
const employees = [];
const form = document.createElement('form');
const submitBtn = document.createElement('button');
const inputNames = ['Name', 'Position', 'Office', 'Age', 'Salary'];
let editedCell;
let currOrder = 'asc';
let currColumnName = '';
let activeLine;

Array.from(table.children).forEach((el) => {
  employees.push({
    Name: el.children[0].textContent,
    Position: el.children[1].textContent,
    Office: el.children[2].textContent,
    Age: el.children[3].textContent,
    Salary: +el.children[4].textContent.replace(/[,$]/g, ''),
  });
});

captions.addEventListener('click', (e) => {
  const sortValue = e.target.textContent;

  employees.sort((a, b) => sortTable(a, b, sortValue));

  if (currColumnName === sortValue && currOrder === 'desc') {
    currOrder = 'asc';
  } else if (currColumnName === sortValue && currOrder === 'asc') {
    currOrder = 'desc';
    employees.reverse();
  }

  if (currColumnName !== sortValue) {
    currColumnName = sortValue;
    currOrder = 'asc';
  }

  render(table, employees);
});

table.addEventListener('click', (e) => {
  if (activeLine && activeLine !== e.target.parentNode) {
    activeLine.classList.remove('active');
  }

  activeLine = e.target.parentNode;
  activeLine.classList.add('active');
});

form.classList.add('new-employee-form');

inputNames.forEach((field) => {
  if (field !== 'Office') {
    const inputType = field === 'Age' || field === 'Salary' ? 'number' : 'text';

    form.insertAdjacentHTML(
      'beforeend',
      `<label>${field}: <input name="${field.toLowerCase()}"
        type="${inputType}" data-qa="${field.toLowerCase()}"
        ></label>`,
    );
  } else {
    const selectOptions = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];
    const options = selectOptions.map(
      (item) => `<option name=${item}>${item}</option>`,
    );

    form.insertAdjacentHTML(
      'beforeend',
      `<label>${field}: <select name="${field.toLowerCase()}" type="text"
        data-qa="${field.toLowerCase()}" required
        >
        ${options}
        </select></label>`,
    );
  }
});
submitBtn.textContent = 'Save to table';
form.append(submitBtn);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationBody = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.className = 'notification';
  notification.append(notificationTitle);
  notification.append(notificationBody);

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const isError = validateData(data, notificationBody);

  if (!isError) {
    employees.push({
      Name: data['name'],
      Position: data['position'],
      Office: data['office'],
      Age: +data['age'],
      Salary: +data['salary'],
    });

    notification.classList.add('success');
    notificationTitle.textContent = 'Success';
    notificationBody.textContent = 'Data successfully added';

    render(table, employees);
    e.target.reset();
  } else {
    notificationTitle.textContent = 'Error';
    notification.classList.add('error');
  }
  document.body.append(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
});

document.body.append(form);

table.addEventListener('dblclick', (e) => {
  editedCell = e.target.textContent;

  e.target.innerHTML = `<input class="cell-input" value="${editedCell}">`;
  e.target.firstChild.focus();
});

document.addEventListener(
  'blur',
  (e) => {
    const target = e.target;

    if (target.classList.contains('cell-input')) {
      const newText = target.value;

      if (newText.trim() !== '') {
        target.parentNode.textContent = newText;
      } else {
        target.parentNode.textContent = editedCell;
      }
    }
  },
  true,
);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const target = e.target;

    if (target.classList.contains('cell-input')) {
      const newText = target.value;

      if (newText.trim() !== '') {
        target.parentNode.textContent = newText;
      } else {
        target.parentNode.textContent = editedCell;
      }
    }
  }
});

function sortTable(a, b, columnName) {
  const first = a[columnName];
  const second = b[columnName];

  if (
    columnName === 'Name' ||
    columnName === 'Position' ||
    columnName === 'Office'
  ) {
    return first.localeCompare(second);
  }

  return first - second;
}

function render(board, content) {
  board.innerHTML = '';

  content.forEach((employee) => {
    const row = document.createElement('tr');

    for (const [key, data] of Object.entries(employee)) {
      const column = document.createElement('td');

      column.textContent = data;

      if (key === 'Salary') {
        const salary = `$${data.toLocaleString()}`;

        column.textContent = salary;
      }

      row.append(column);
    }
    board.append(row);
  });
}

function validateData(data, text) {
  if (data['name'].trim().length < 4) {
    text.textContent = 'Please, enter a correct name!';

    return true;
  }

  if (data['position'].trim() === '') {
    text.textContent = 'Position is required';

    return true;
  }

  if (data['age'] < 18 || data['age'] > 90) {
    text.textContent = 'Age must be between 18 and 90.';

    return true;
  }

  if (data['salary'] <= '0' || data['salary'].trim() === '') {
    text.textContent = 'Salary is required';

    return true;
  }
}
