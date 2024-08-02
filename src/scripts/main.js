'use strict';

const table = document.querySelector('table');
const titleContainer = document.querySelector('thead tr');
const titleTable = titleContainer.querySelectorAll('th');
const bodyTable = document.querySelector('tbody');
const columns = [...bodyTable.querySelectorAll('tr')];

const form = document.createElement('form');
const button = document.createElement('button');

form.classList.add('new-employee-form');
form.method = 'post';
form.action = '#';
document.body.append(form);

for (let i = 0; i < titleTable.length; i++) {
  const lable = document.createElement('label');
  const nameLower = titleTable[i].innerText.toLowerCase();

  form.append(lable);

  if (titleTable[i].innerText === 'Office') {
    const selectOffice = document.createElement('select');

    lable.append(`${titleTable[i].innerText}:`, selectOffice);
    selectOffice.dataset.qa = titleTable[i].innerText.toLowerCase();
    selectOffice.value = titleTable[i].innerText.toLowerCase();

    const list = [];

    columns.forEach((element) => {
      if (!list.includes(element.cells[i].innerHTML)) {
        list.push(element.cells[i].innerHTML);
      }
    });

    list.forEach((name1) => {
      const option = document.createElement('option');

      option.value = name1;
      option.textContent = name1;

      selectOffice.append(option);
    });

    continue;
  }

  const input = document.createElement('input');

  input.name = nameLower;
  input.dataset.qa = nameLower;
  input.value = input.textContent;
  lable.append(`${titleTable[i].innerText}:`, input);

  if (input.name === 'name' || input.name === 'position') {
    input.type = 'text';
  }

  if (input.name === 'age' || input.name === 'salary') {
    input.type = 'number';
  }
}

button.innerText = 'Save to table';
button.type = 'submit';
form.append(button);

button.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    form.elements.name.value.trim().length >= 4 &&
    form.elements.position.value.trim().length >= 4 &&
    parseInt(form.elements.age.value) >= 18 &&
    parseInt(form.elements.age.value) <= 90
  ) {
    const row = bodyTable.insertRow();

    for (let i = 0; i < bodyTable.rows[0].cells.length; i++) {
      row.insertCell();

      if (form.elements[i].name === 'salary') {
        row.cells[i].textContent =
          `$${Number(form.elements[i].value).toLocaleString('en-US')}`;
        continue;
      }
      row.cells[i].textContent = form.elements[i].value;
    }

    pushNotification(
      'Title of Success message',
      'Notification should contain title and description.',
      'success',
    );
  } else {
    pushNotification(
      'Error!',
      'Notification should contain title and description.',
      'error',
    );
  }
});

const pushNotification = (title, description, type) => {
  const container = document.createElement('div');
  const h = document.createElement('h2');
  const p = document.createElement('p');

  container.dataset.qa = 'notification';
  container.classList.add('notification');
  container.classList.add(`${type}`);
  h.classList.add('title');
  h.textContent = title;
  p.innerHTML = description;
  document.body.append(container);
  container.append(h);
  container.append(p);

  setTimeout(() => {
    container.style.display = 'none';
  }, 2000);
};

titleContainer.addEventListener('click', (e) => {
  const target = e.target;

  const index = target.cellIndex;

  if (index === 0 || index === 1 || index === 2) {
    deleteClass(titleContainer.cells, index);

    if (target.classList.contains('asc')) {
      const sortNameDESC = columns.sort((a, b) => {
        return b.cells[index].innerHTML
          .toLowerCase()
          .localeCompare(a.cells[index].innerHTML.toLowerCase());
      });

      target.classList.toggle('asc');
      table.tBodies[0].append(...sortNameDESC);
    } else {
      const sortName = columns.sort((a, b) => {
        return a.cells[index].innerHTML
          .toLowerCase()
          .localeCompare(b.cells[index].innerHTML.toLowerCase());
      });

      target.classList.toggle('asc');
      table.tBodies[0].append(...sortName);
    }
  }

  if (index === 3) {
    deleteClass(titleContainer.cells, index);

    if (target.classList.contains('asc')) {
      const sortAgeDesk = columns.sort(
        (rowA, rowB) =>
          rowB.cells[index].innerHTML - rowA.cells[index].innerHTML,
      );

      table.tBodies[0].append(...sortAgeDesk);
      target.classList.toggle('asc');
    } else {
      const sortAge = columns.sort(
        (rowA, rowB) => rowA.cells[3].innerHTML - rowB.cells[3].innerHTML,
      );

      table.tBodies[0].append(...sortAge);
      target.classList.toggle('asc');
    }
  }

  if (index === 4) {
    deleteClass(titleContainer.cells, index);

    if (target.classList.contains('asc')) {
      const sortNumDesk = columns.sort(
        (a, b) =>
          getNumber(b.cells[index].innerHTML) -
          getNumber(a.cells[index].innerHTML),
      );

      target.classList.toggle('asc');
      table.tBodies[0].append(...sortNumDesk);
    } else {
      const sortSalary = columns.sort(
        (a, b) =>
          getNumber(a.cells[index].innerHTML) -
          getNumber(b.cells[index].innerHTML),
      );

      target.classList.toggle('asc');
      table.tBodies[0].append(...sortSalary);
    }
  }
});

function deleteClass(array, obj) {
  for (let i = 0; i < array.length; i++) {
    if (i === obj) {
      continue;
    }

    if (array[i].classList.contains('asc')) {
      array[i].classList.toggle('asc');
    }
  }
}

function getNumber(str) {
  const num = str.split(',').join('').split('');

  num.shift();

  return parseInt(num.join(''));
}

let activeRow;

bodyTable.addEventListener('click', (e) => {
  e.preventDefault();

  const target = e.target.closest('tr');

  if (!bodyTable.contains(target)) {
    return;
  }

  if (!target) {
    return;
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }
  activeRow = target;
  activeRow.classList.add('active');
});
