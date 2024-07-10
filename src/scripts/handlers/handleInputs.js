import addSelect from '../components/addSelect';

const handleInputs = (ev, ths) => {
  const cell = ev.target;
  const thIndex = [...cell.parentNode.children].indexOf(cell);

  if (cell.nodeName !== 'TD') {
    return;
  }

  const initialText = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialText;
  cell.textContent = '';
  cell.append(input);
  input.focus();

  if (thIndex === 2) {
    cell.firstChild.remove();
    addSelect(cell, ths[thIndex]);
    cell.firstChild.focus();
  }

  cell.firstElementChild.addEventListener('blur', (e) => {
    let cellContent = e.target.value;

    if (thIndex === 2) {
      cellContent = e.target.selectedOptions[0].label;
    }

    cell.textContent = cellContent || initialText;
    cell.firstElementChild.remove();
  });

  cell.firstElementChild.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      let cellContent = e.target.value;

      if (thIndex === 2) {
        cellContent = e.target.selectedOptions[0].label;
      }

      cell.textContent = cellContent || initialText;
      cell.firstElementChild.remove();
    }
  });
};

export default handleInputs;
