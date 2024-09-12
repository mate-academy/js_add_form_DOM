'use strict';

const td = document.querySelectorAll('td');
const arr = {};
let counter = 0;
let isSorted = '';

for (let i = 0; i < td.length / 5; i++) {
  createRows(i, counter, counter + 5);
  counter += 5;
}

document.addEventListener('click', (e) => {
  if (isSorted === e.target.textContent) {
    switch (e.target.textContent) {
      case 'Name':
        sortTable(0, false);
        isSorted = '';
        break;
      case 'Position':
        sortTable(1, false);
        isSorted = '';
        break;
      case 'Office':
        sortTable(2, false);
        isSorted = '';
        break;
      case 'Age':
        sortTable(3, false);
        isSorted = '';
        break;
      case 'Salary':
        sortTable(4, false);
        isSorted = '';
        break;
    }
  } else {
    switch (e.target.textContent) {
      case 'Name':
        sortTable(0, true);
        isSorted = 'Name';
        break;
      case 'Position':
        sortTable(1, true);
        isSorted = 'Position';
        break;
      case 'Office':
        sortTable(2, true);
        isSorted = 'Office';
        break;
      case 'Age':
        sortTable(3, true);
        isSorted = 'Age';
        break;
      case 'Salary':
        sortTable(4, true);
        isSorted = 'Salary';
        break;
    }
  }

  if (e.target.tagName === 'TD') {
    for (let i = 0; i < document.querySelectorAll('tr').length; i++) {
      document.querySelectorAll('tr')[i].classList.remove('active');
    }

    e.target.closest('tr').classList = 'active';
  }
});

function createRows(rowNumber, start, end) {
  arr[rowNumber] = [];

  for (let i = start; i < end; i++) {
    arr[rowNumber].push(td[i]);
  }
}

function sortTable(index, order) {
  const array = [];

  for (const k in arr) {
    array.push(arr[k]);
  }

  if (order === true) {
    array.sort((a, b) => {
      let first = a[index].textContent;
      let second = b[index].textContent;

      if (index === 4) {
        first = parseFloat(first.replace(/[^0-9.-]+/g, '')) || 0;
        second = parseFloat(second.replace(/[^0-9.-]+/g, '')) || 0;
      }

      if (first < second) {
        return -1;
      }

      if (first > second) {
        return 1;
      }

      return 0;
    });
  } else {
    array.sort((a, b) => {
      let first = a[index].textContent;
      let second = b[index].textContent;

      if (index === 4) {
        first = parseFloat(first.replace(/[^0-9.-]+/g, '')) || 0;
        second = parseFloat(second.replace(/[^0-9.-]+/g, '')) || 0;
      }

      if (first < second) {
        return 1;
      }

      if (first > second) {
        return -1;
      }

      return 0;
    });
  }

  const par = td[0].parentElement.parentElement;

  par.innerHTML = '';

  array.forEach((row) => {
    const tr = document.createElement('tr');

    row.forEach((cell) => tr.appendChild(cell));
    par.appendChild(tr);
  });
}

function createLabelsWithInputs(innerText, inpName, inputType) {
  const label = document.createElement('label');

  label.textContent = innerText;

  const input = document.createElement('input');

  input.name = inpName;

  input.type = inputType;

  input.required = true;

  input.dataset.qa = inpName;

  label.appendChild(input);

  return label;
}

function createOption(inp) {
  const option = document.createElement('option');

  option.value = inp.toLowerCase();

  option.innerText = inp;

  return option;
}

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.appendChild(form);

const selectButton = document.createElement('select');

selectButton.dataset.qa = 'office';
selectButton.required = true;

selectButton.appendChild(createOption('Tokyo'));
selectButton.appendChild(createOption('Singapore'));
selectButton.appendChild(createOption('London'));
selectButton.appendChild(createOption('New York'));
selectButton.appendChild(createOption('Edinburgh'));
selectButton.appendChild(createOption('San Francisco'));

const labelto = document.createElement('label');

labelto.textContent = 'Office: ';

labelto.appendChild(selectButton);

form.appendChild(createLabelsWithInputs('Name: ', 'name', 'text'));
form.appendChild(createLabelsWithInputs('Position: ', 'position', 'text'));
form.appendChild(labelto);
form.appendChild(createLabelsWithInputs('Age: ', 'age', 'number'));
form.appendChild(createLabelsWithInputs('Salary: ', 'salary', 'number'));

const sendButon = document.createElement('button');

sendButon.class = 'saveButon';

sendButon.innerText = 'Save to table';

form.appendChild(sendButon);

sendButon.addEventListener('click', (e) => {
  e.preventDefault();

  let preventSubmit = false;

  if (
    document.querySelector('input[name="name"]').value.length === 0 ||
    document.querySelector('input[name="position"]').value.length === 0 ||
    document.querySelector('input[name="age"]').value.length === 0 ||
    document.querySelector('input[name="salary"]').value.length === 0
  ) {
    notice('error', 'Please fill all the fields');
    preventSubmit = true;
  } else if (document.querySelector('input[name="name"]').value.length < 4) {
    notice('error', 'Name should be at least 4 letters long');
    preventSubmit = true;
  } else if (
    document.querySelector('input[name="age"]').value < 18 ||
    document.querySelector('input[name="age"]').value > 90
  ) {
    notice('error', 'Age should be between 18 and 90');
    preventSubmit = true;
  } else if (
    document.querySelector('input[name="salary"]').value.includes('-')
  ) {
    notice('error', `Salary can't be negative`);
  } else {
    notice('success', 'Employee was added successfully');
    addEmplToPage();
  }

  if (preventSubmit) {
    e.preventDefault();
  }
});

function notice(type, message) {
  const noticeDive = document.createElement('div');

  noticeDive.dataset.qa = 'notification';

  noticeDive.className = `notification ${type}`;

  if (type === 'error') {
    noticeDive.innerHTML = `<div class = 'title'>Error</div> ${message}`;
  } else {
    noticeDive.innerHTML = `<div class = 'title'>Success</div> ${message}`;
  }

  document.body.appendChild(noticeDive);

  setTimeout(() => {
    noticeDive.style.display = 'none';
  }, 4000);
}

function addEmplToPage() {
  const newRow = document.createElement('tr');

  const newName = document.createElement('td');
  const newPosition = document.createElement('td');
  const newOffice = document.createElement('td');
  const newAge = document.createElement('td');
  const newSalary = document.createElement('td');

  newPosition.innerText = document.querySelector(
    'input[name="position"]',
  ).value;
  newName.innerText = document.querySelector('input[name="name"]').value;
  newOffice.innerText = office();
  newAge.innerText = document.querySelector('input[name="age"]').value;
  newSalary.innerText = salary();

  newRow.appendChild(newName);
  newRow.appendChild(newPosition);
  newRow.appendChild(newOffice);
  newRow.appendChild(newAge);
  newRow.appendChild(newSalary);

  document.querySelector('tbody').appendChild(newRow);

  arr[Object.keys(arr).length] = [
    newName,
    newPosition,
    newOffice,
    newAge,
    newSalary,
  ];

  clearform();
}

function office() {
  const value = document.querySelector('[data-qa="office"]').value;

  if (!value.includes(' ')) {
    return value.slice(0, 1).toUpperCase() + value.slice(1);
  } else {
    return (
      value.split(' ')[0].slice(0, 1).toUpperCase() +
      value.split(' ')[0].slice(1) +
      ' ' +
      value.split(' ')[1].slice(0, 1).toUpperCase() +
      value.split(' ')[1].slice(1)
    );
  }
}

function salary() {
  let sum = document.querySelector('input[name="salary"]').value;

  sum = sum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `$${sum}`;
}

function clearform() {
  document.querySelector('input[name="position"]').value = '';
  document.querySelector('input[name="name"]').value = '';
  document.querySelector('input[name="age"]').value = '';
  document.querySelector('input[name="salary"]').value = '';
}

document.querySelectorAll('td').forEach((iter) => {
  iter.addEventListener('dblclick', (e) => {
    const prevText = iter.innerText;
    const inp = document.createElement('input');

    inp.className = 'cell-input';
    inp.type = 'text';
    inp.value = prevText;

    iter.innerText = '';

    iter.appendChild(inp);
    inp.focus();

    inp.addEventListener('blur', (ev) => {
      if (prevText.includes('$')) {
        let replaced = inp.value.replace(/[^0-9.-]+/g, '');

        replaced = replaced.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        inp.value = `$${replaced}`;
      }
      iter.innerText = inp.value || prevText;
    });

    inp.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        if (prevText.includes('$')) {
          let replaced = inp.value.replace(/[^0-9.-]+/g, '');

          replaced = replaced.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          inp.value = `$${replaced}`;
        }
        iter.innerText = inp.value || prevText;
      }
    });
  });
});
