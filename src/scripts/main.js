'use strict';

const people = [];
let trs = document.querySelectorAll('tr');

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');

// #region creating an array of all people
for (let i = 1; i < trs.length - 1; i++) {
  const person = {};

  person.name = trs[i].children[0].textContent;
  person.position = trs[i].children[1].textContent;
  person.office = trs[i].children[2].textContent;
  person.age = trs[i].children[3].textContent;
  person.salary = trs[i].children[4].textContent;

  people.push(person);
}

// #endregion
// #region default sorting directions
let isNameSortedAsc = true;
let isPositionSortedAsc = true;
let isOfficeSortedAsc = true;
let isAgeSortedAsc = true;
let isSalarySortedAsc = true;
// #endregion

makeRawsActiveOnClick();

// #region development of table sorting by click
for (let i = 0; i < 5; i++) {
  trs[0].children[i].addEventListener('click', () => {
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }

    const peopleSorted = structuredClone(people);

    switch (i) {
      case 0:
        if (isNameSortedAsc) {
          peopleSorted.sort((a, b) => a.name.localeCompare(b.name));
          isNameSortedAsc = !isNameSortedAsc;
        } else {
          peopleSorted.sort((a, b) => b.name.localeCompare(a.name));
          isNameSortedAsc = !isNameSortedAsc;
        }
        break;
      case 1:
        if (isPositionSortedAsc) {
          peopleSorted.sort((a, b) => a.position.localeCompare(b.position));
          isPositionSortedAsc = !isPositionSortedAsc;
        } else {
          peopleSorted.sort((a, b) => b.position.localeCompare(a.position));
          isPositionSortedAsc = !isPositionSortedAsc;
        }
        break;
      case 2:
        if (isOfficeSortedAsc) {
          peopleSorted.sort((a, b) => a.office.localeCompare(b.office));
          isOfficeSortedAsc = !isOfficeSortedAsc;
        } else {
          peopleSorted.sort((a, b) => b.office.localeCompare(a.office));
          isOfficeSortedAsc = !isOfficeSortedAsc;
        }
        break;
      case 3:
        if (isAgeSortedAsc) {
          peopleSorted.sort((a, b) => a.age - b.age);
          isAgeSortedAsc = !isAgeSortedAsc;
        } else {
          peopleSorted.sort((a, b) => b.age - a.age);
          isAgeSortedAsc = !isAgeSortedAsc;
        }
        break;

      case 4:
        if (isSalarySortedAsc) {
          peopleSorted.sort(
            (a, b) => parseSalaryInt(a.salary) - parseSalaryInt(b.salary),
          );
          isSalarySortedAsc = !isSalarySortedAsc;
        } else {
          peopleSorted.sort(
            (a, b) => parseSalaryInt(b.salary) - parseSalaryInt(a.salary),
          );
          isSalarySortedAsc = !isSalarySortedAsc;
        }
    }

    for (let j = 0; j < peopleSorted.length; j++) {
      const tr = document.createElement('tr');

      const personName = document.createElement('td');

      personName.textContent = peopleSorted[j].name;
      tr.appendChild(personName);

      const personPosition = document.createElement('td');

      personPosition.textContent = peopleSorted[j].position;
      tr.appendChild(personPosition);

      const personOffice = document.createElement('td');

      personOffice.textContent = peopleSorted[j].office;
      tr.appendChild(personOffice);

      const personAge = document.createElement('td');

      personAge.textContent = peopleSorted[j].age;
      tr.appendChild(personAge);

      const personSalary = document.createElement('td');

      personSalary.textContent = peopleSorted[j].salary;
      tr.appendChild(personSalary);

      tbody.appendChild(tr);
    }

    trs = document.querySelectorAll('tr');

    makeRawsActiveOnClick();
  });
}

// #endregion
// #region function parseSalaryInt
function parseSalaryInt(salary) {
  return +salary.split(',').join('').split('$').join('');
}

// #endregion
// #region function parseSalaryString
function parseSalaryString(salary) {
  const salaryArray = String(salary).split('');
  const salaryStrArray = [];

  switch (salaryArray.length % 3) {
    case 1:
      salaryStrArray.push(salaryArray[0]);
      break;
    case 2:
      salaryStrArray.push(salaryArray[0] + salaryArray[1]);
      break;
  }

  for (let i = salaryArray.length % 3; i < salaryArray.length; i += 3) {
    salaryStrArray.push(
      salaryArray[i] + salaryArray[i + 1] + salaryArray[i + 2],
    );
  }

  const salaryString = '$' + salaryStrArray.join(',');

  return salaryString;
}

// #endregion
// #region function makeRawsActiveOnClick
function makeRawsActiveOnClick() {
  for (let i = 1; i < trs.length - 1; i++) {
    trs[i].addEventListener('click', () => {
      for (let j = 1; j < trs.length - 1; j++) {
        trs[j].removeAttribute('class');
      }
      trs[i].setAttribute('class', 'active');
    });
  }
}

// #endregion
// #region creating a form to add new employees to the spreadsheet
const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');

const labelName = document.createElement('label');

labelName.textContent = 'Name: ';

const inputName = document.createElement('input');

inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');
inputName.setAttribute('required', '');
inputName.setAttribute('data-qa', 'name');
labelName.appendChild(inputName);
form.appendChild(labelName);

const labelPosition = document.createElement('label');

labelPosition.textContent = 'Position: ';

const inputPosition = document.createElement('input');

inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');
inputPosition.setAttribute('data-qa', 'position');
labelPosition.appendChild(inputPosition);
form.appendChild(labelPosition);

const labelOffice = document.createElement('label');

labelOffice.textContent = 'Office: ';

const selectOffice = document.createElement('select');

selectOffice.setAttribute('required', '');
selectOffice.setAttribute('data-qa', 'office');

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const city of cities) {
  const option = document.createElement('option');

  option.textContent = city;
  selectOffice.appendChild(option);
}

labelOffice.appendChild(selectOffice);
form.appendChild(labelOffice);

const labelAge = document.createElement('label');

labelAge.textContent = 'Age: ';

const inputAge = document.createElement('input');

inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('required', '');
inputAge.setAttribute('data-qa', 'age');
labelAge.appendChild(inputAge);
form.appendChild(labelAge);

const labelSalary = document.createElement('label');

labelSalary.textContent = 'Salary: ';

const inputSalary = document.createElement('input');

inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');
inputSalary.setAttribute('required', '');
inputSalary.setAttribute('data-qa', 'salary');
labelSalary.appendChild(inputSalary);
form.appendChild(labelSalary);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';
form.appendChild(button);

table.after(form);

// #endregion
// #region function to show notification
function showNotification(message, isError = false) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');

  notification.className = isError
    ? 'notification error'
    : 'notification success';

  const title = document.createElement('h2');

  title.textContent = message;
  title.className = 'title';
  notification.appendChild(title);
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// #endregion
// #region adding new employees to the spreadsheet
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = inputName.value;
  const positionValue = inputPosition.value;
  const ageValue = +inputAge.value;

  if (nameValue.trim().length < 4) {
    showNotification('Name must have at least 4 letters', true);

    return;
  }

  if (
    positionValue
      .split('')
      .some((a) => a.toUpperCase() === a.toLowerCase() && a !== ' ') ||
    !positionValue ||
    positionValue.trim().length === 0
  ) {
    showNotification(
      'Position is required and must consist of letters only',
      true,
    );

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    showNotification('Age must be between 18 and 90', true);

    return;
  }

  const newPerson = {
    name: nameValue,
    position: inputPosition.value,
    office: selectOffice.value,
    age: ageValue,
    salary: parseSalaryString(inputSalary.value),
  };

  people.push(newPerson);

  const tr = document.createElement('tr');

  for (const key in newPerson) {
    const td = document.createElement('td');

    td.textContent = newPerson[key];
    tr.appendChild(td);
  }

  tbody.appendChild(tr);
  trs = document.querySelectorAll('tr');
  makeRawsActiveOnClick();

  showNotification('New employee added successfully');

  form.reset();
});
// #endregion
