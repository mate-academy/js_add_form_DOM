import addSelect from './addSelect';

const addForm = (body, ths) => {
  const form = document.createElement('form');
  const submitBtn = document.createElement('button');

  for (const th of ths) {
    const inputName = th.textContent.toLocaleLowerCase();
    const type =
      inputName === 'age' || inputName === 'salary' ? 'number' : 'text';

    if (inputName === 'office') {
      addSelect(form, th);
      continue;
    }

    const input = document.createElement('input');

    input.name = inputName;
    input.type = type;
    input.setAttribute('data-qa', inputName);
    // input.required = true;

    form.innerHTML += `<label>${th.textContent}: ${input.outerHTML}</label>`;
  }
  form.classList.add('new-employee-form');
  submitBtn.textContent = 'Save to table';
  submitBtn.classList.add('submit');

  form.append(submitBtn);
  body.append(form);
};

export default addForm;
