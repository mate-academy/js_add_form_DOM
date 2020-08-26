'use strict';

const employees = [...document.querySelectorAll('tbody tr')];

(function tableSorter() {
  const categories = [...document.querySelectorAll(`thead th`)];
  const backwards = [];

  for (let categoryIndex = 0;
    categoryIndex < categories.length;
    categoryIndex++) {
    backwards.push(false);

    categories[categoryIndex].onclick = () => {
      employees.sort(sorterConstructor(
        categoryIndex, backwards[categoryIndex]
      ));
      backwards[categoryIndex] = !backwards[categoryIndex];

      for (let i = 0; i < backwards.length; i++) {
        if (i !== categoryIndex) {
          backwards[i] = false;
        }
      }

      document.querySelector('tbody').append(...employees);
    };
  };

  function sorterConstructor(sortByIndex, back) {
    function itemFormatter(item) {
      return item.children[sortByIndex].innerHTML
        .split('$').join('').split(',').join('');
    };

    return function(a, b) {
      let itemA = itemFormatter(a);
      let itemB = itemFormatter(b);

      if (isNaN(itemA)) {
        itemA = itemA.toUpperCase();
        itemB = itemB.toUpperCase();
      } else {
        itemA = +itemA;
        itemB = +itemB;
      };

      if (back) {
        return itemB > itemA ? 1 : -1;
      } else {
        return itemB < itemA ? 1 : -1;
      }
    };
  };
})();

selectAdder();

function selectAdder() {
  for (const employee of employees) {
    employee.onclick = () => {
      const currentActive = document.querySelector('.active');

      if (currentActive) {
        currentActive.classList.remove('active');
      }

      employee.classList.add('active');
    };
  }
};

(function formAdder() {
  document.body.insertAdjacentHTML('beforeend', `
    <form class="new-employee-form" action="/" method="GET">
      <label>
        Name:
        <input name="name" type="text" required>
      </label>

      <label>
        Position:
        <input name="position" type="text" required>
      </label>

      <label>
        Office:
        <select name="office">
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>

      <label>
        Age:
        <input name="age" type="number" required>
      </label>

      <label>
        Salary:
        <input
          name="salary"
          type="number"
          required
          onkeyup="this.value = this.value.replace(/[A-Za-zА-Яа-яЁё]/, '');"
        >
      </label>

      <button type="submit">Save to table</button>
    </form>
  `);

  document.querySelector('button[type=submit]').onclick = (dblClickEvent) => {
    dblClickEvent.preventDefault();

    const name = document.querySelector('input[name=name]').value;
    const position = document.querySelector('input[name=position]').value;
    const office = document.querySelector('select[name=office]').value;
    const age = document.querySelector('input[name=age]').value;
    const salary = document.querySelector('input[name=salary]').value;

    if (age < 18) {
      pushNotification('10px', '10px', 'Error!',
        `Age can't be less then 18`,
        `error`
      );

      return;
    }

    if (age > 90) {
      pushNotification('10px', '10px', 'Error!',
        `Age can't be greater then 90`,
        `error`
      );

      return;
    }

    if (name.length < 4) {
      pushNotification('10px', '10px', 'Error!',
        `Name can't be less than 4 letters.
          <br>
          So, if ur name is Ray, Bob, etc,
          you are not able to use table. Goodluck:)`,
        `error`
      );

      return;
    }

    if (+salary === 0) {
      pushNotification('10px', '10px', 'Error!',
        `Incorrect salary value`,
        `error`
      );

      return;
    }

    const newEmployee = document.createElement('tr');

    newEmployee.insertAdjacentHTML('beforeend', `
      <td>${name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${Number(salary).toLocaleString().replace(/\s/g, ',')}</td>
    `);

    document.querySelector('tbody').append(newEmployee);
    employees.push(newEmployee);
    selectAdder();

    pushNotification('10px',
      '10px',
      'Success!',
      `A new employee was added`,
      `success`
    );
  };
})();

function pushNotification(top, right, title, description, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;

  notification.style = `
    position: absolute;
    top: ${top};
    right: ${right};
  `;

  notification.insertAdjacentHTML('beforeend', `
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    `
  );

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
};

(function cellEditor() {
  document.querySelector('tbody')
    .addEventListener('dblclick', (dblClickEvent) => {
      const initialValue = dblClickEvent.target.textContent;
      const input = document.createElement('input');

      input.className = 'cell-input';
      input.value = initialValue;
      input.style.width = window.getComputedStyle(dblClickEvent.target).width;

      dblClickEvent.target.style.padding = '17px';
      dblClickEvent.target.innerHTML = '';
      dblClickEvent.target.append(input);
      input.focus();

      input.onblur = exitEditMode;

      input.onkeyup = (keyupEvent) => {
        if (keyupEvent.which === 13) {
          exitEditMode();
        }
      };

      function exitEditMode() {
        dblClickEvent.target.innerHTML = input.value
          ? input.value
          : initialValue;
      };
    });
})();
