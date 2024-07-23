export function addNewRow(arrOfValues) {
  const tbody = document.querySelector('tbody');

  tbody.append(tbody.lastElementChild.cloneNode(true));

  [...tbody.lastElementChild.children].forEach((el, i) => {
    el.innerText = arrOfValues[i];
  });
}
