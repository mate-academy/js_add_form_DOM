'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead tr');
const tBody = table.querySelector('tbody');

const markUpHeaders = [...tHead.children].map((th) => {
  return th.textContent;
});

function spreadSettingsEmployees(arrayTr) {
  const peopleObj = arrayTr.map((tr) => {
    const obj = {};

    for (let i = 0; i < tr.children.length; i++) {
      obj[markUpHeaders[i]] = tr.children[i].textContent;
    }

    return obj;
  });

  return peopleObj;
}

function sortEmployees(sortName, arrayEmployyes) {
  switch (sortName) {
    case 'Name':
    case 'Position':
    case 'Office':
      return arrayEmployyes.sort((a, b) => {
        return a[sortName].localeCompare(b[sortName]);
      });

    case 'Age':
      return arrayEmployyes.sort((a, b) => {
        return +a[sortName] - +b[sortName];
      });

    case 'Salary':
      return arrayEmployyes.sort((a, b) => {
        const aSal = +a[sortName].slice(1).replace(',', '');
        const bSal = +b[sortName].slice(1).replace(',', '');

        return aSal - bSal;
      });

    default:
      break;
  }
}

function reRenderTableBody(employees, sortName, reverse = false) {
  const tbody = document.querySelector('tbody');

  if (reverse) {
    employees.reverse();
  } else {
    sortEmployees(sortName, employees);
  }

  [...tbody.children].forEach((tr) => {
    tr.remove();
  });

  employees
    .map((item) => {
      return `
    <tr>
    <td>${item.Name} </td>
    <td>${item.Position} </td>
    <td>${item.Office} </td>
    <td>${item.Age} </td>
    <td>${item.Salary} </td>
    </tr>
    `;
    })
    .forEach((tr) => {
      tbody.insertAdjacentHTML('beforeend', tr);
    });
}

function counterClick() {
  const downList = [];

  return (nameSort) => {
    downList.push(nameSort);

    return downList;
  };
}

const counterClicks = counterClick();

tHead.addEventListener('click', (e) => {
  const sortName = e.target.textContent;

  const employees = spreadSettingsEmployees([...tBody.children]);

  const counter = [...counterClicks(sortName)];

  if (counter[counter.length - 2] === sortName) {
    reRenderTableBody(employees, sortName, true);
  } else {
    reRenderTableBody(employees, sortName);
  }
});

/* ----------------------------------------------------------- */

tBody.addEventListener('click', (e) => {
  [...tBody.children].forEach((tr) => {
    tr.classList.remove('active');
  });

  e.target.closest('tr').classList.add('active');
});

function validateSalaryInput(value) {
  const num = +[...value].filter((val) => +val >= 0).join('');

  return '$' + num.toLocaleString('en-US');
}

function validateAgeInput(value, prevValue) {
  const num = +[...value].filter((val) => +val >= 0).join('');

  if (num < 18) {
    return prevValue;
  }

  if (num > 90) {
    return prevValue;
  }

  return num;
}

tBody.addEventListener('dblclick', (e) => {
  const td = { elem: e.target, data: e.target.textContent };
  const input = document.createElement('input');
  const body = document.querySelector('body');

  input.style.maxWidth = e.target.clientWidth + 'px';
  input.value = td.data.trim();
  e.target.textContent = '';

  e.target.append(input);

  input.focus();

  // for validation when dblClick
  let flagDoll = false;
  let flagNumber = false;

  if (input.value.includes('$') && input.closest('.active').children[4]) {
    flagDoll = true;
    input.value = input.value.slice(1);
  }

  if (
    +input.value &&
    typeof +input.value === 'number' &&
    input.closest('.active').children[3]
  ) {
    flagNumber = true;
  }

  body.addEventListener('click', (ev) => {
    if (ev.target.tagName !== 'INPUT') {
      if (!input.value) {
        td.elem.innerText = td.data;

        return;
      }

      if (flagDoll) {
        td.elem.innerText = validateSalaryInput(input.value);
      } else if (flagNumber) {
        td.elem.innerText = validateAgeInput(input.value, td.data);
      } else {
        td.elem.innerText = input.value;
      }
    }
  });

  // eslint-disable-next-line no-shadow
  input.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      if (!input.value) {
        td.elem.innerText = td.data;

        return;
      }

      if (flagDoll) {
        td.elem.innerText = validateSalaryInput(input.value);
      } else if (flagNumber) {
        td.elem.innerText = validateAgeInput(input.value);
      } else {
        td.elem.innerText = input.value;
      }
    }
  });
});

/* create from for next using */
function addForm(selector) {
  const markUpForm = `
      <form
      action="#"
      class="new-employee-form"
    >
      <label> Name:
        <input
          type="text"
          data-qa="name"
          required
        >
      </label>
      <label> Position:
        <input
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
          <option
            value="Tokyo"
            selected
          >Tokyo</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="Singapure">Singapure</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label> Age:
        <input
          type="number"
          data-qa="age"
          required
        >
      </label>
      <label> Salary
        <input
          type="number"
          data-qa="salary"
          required
        >
      </label>
      <button type="submit">Save to table</button>
    </form>
  `;

  selector.insertAdjacentHTML('afterend', markUpForm);

  const formEmployee = document.querySelector('form');

  formEmployee.style.opacity = 0;
  formEmployee.style.transition = 'all 1.0s';

  setTimeout(() => {
    formEmployee.style.opacity = 1;
  }, 500);
}

addForm(table);

/* --------------- */

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = [...form.elements];

  const newEmployee = [];

  inputs.forEach((input) => {
    newEmployee.push(input.value);
  });

  newEmployee.splice(-1);

  const [flag, notification] = validationValues(newEmployee);

  if (flag) {
    table.insertAdjacentHTML('afterend', notification);

    const notif = document.querySelector('.notification');

    notif.style.zIndex = 99;

    setTimeout(() => {
      notif.remove();
    }, 2000);

    addEmployeeToTable(newEmployee);
    form.reset();
  } else {
    table.insertAdjacentHTML('afterend', notification);

    const notif = document.querySelector('.notification');

    notif.style.zIndex = 99;

    setTimeout(() => {
      notif.remove();
    }, 2000);
  }
});

function validationValues(newEmployee) {
  const [nameEmp, , , age, ,] = newEmployee;

  let notification = `
     <div class="notification success" data-qa="notification">
       <h1 class="title">Sucsess</h1>
       <p>Employee has been added</p>
    </div>
    `;

  if (nameEmp.length < 4) {
    notification = `
    <div class="notification error" data-qa="notification">
      <h1 class="title">Error</h1>
      <p><b>Name</b> value less than 4 letters</p>
   </div>
   `;

    return [false, notification];
  }

  if (+age < 18 || +age > 90) {
    notification = `
    <div class="notification error" data-qa="notification">
      <h1 class="title">Error</h1>
      <p><b>Age</b> value is less than 18 or more than 90</p>
   </div>
   `;

    return [false, notification];
  }

  return [true, notification];
}

function addEmployeeToTable(newEmployee) {
  const tbody = document.querySelector('table tbody');

  const tr = document.createElement('tr');

  newEmployee.forEach((item, i, arr) => {
    if (i === arr.length - 1) {
      // eslint-disable-next-line no-param-reassign
      item = '$' + (+item).toLocaleString('en-US');
    }
    tr.insertAdjacentHTML('beforeend', `<td>${item}</td>`);
  });

  tbody.insertAdjacentElement('beforeend', tr);
}
