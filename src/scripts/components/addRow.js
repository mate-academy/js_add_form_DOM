import salarize from '../utils/salarize';

function addRow(form, table) {
  const dataFields = form.querySelectorAll('label');
  const tr = document.createElement('tr');

  [...dataFields].forEach((field) => {
    if (field.children[0].nodeName === 'SELECT') {
      tr.innerHTML += `<td>${field.children[0].selectedOptions[0].label}</td>`;
    } else if (field.children[0].name === 'salary') {
      tr.innerHTML += `<td>${salarize(field.children[0].value)}</td>`;
    } else {
      tr.innerHTML += `<td>${field.children[0].value}</td>`;
    }
  });

  table.tBodies[0].append(tr);
  form.reset();
}

export default addRow;
