import { variables } from './../config/variables';

const addSelect = (element, th) => {
  const select = document.createElement('select');
  const label = document.createElement('label');

  variables.cities.forEach((city) => {
    const option = document.createElement('option');

    option.value = city;
    option.label = city;
    select.append(option);
  });

  select.setAttribute('data-qa', 'office');
  select.required = true;

  if (element.tagName === 'FORM') {
    label.innerHTML = th.textContent;

    label.append(select);
    element.append(label);

    return;
  }

  select.style.cssText = `
    width: 150px;
    box-sizing: border-box;
    border: 1px solid #808080;
    border-radius: 4px;
    color: #808080;
    padding: 4px;
    outline-color: #808080;
  `;

  element.append(select);
};

export default addSelect;
