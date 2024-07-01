import { formatToCurrency } from './utils';

export class CellEdit {
  static #createInput(columnType) {
    const input = document.createElement('input');

    input.classList.add('cell-input');

    if (columnType === 'age' || columnType === 'salary') {
      input.setAttribute('type', 'number');
    }

    return input;
  }

  static #onCellBlur(e, columnType, currentValue) {
    const { target } = e;
    const { parentNode, value } = target;

    let newValue = value;

    if (columnType === 'salary') {
      newValue = value ? formatToCurrency(value) : null;
    }

    target.remove();

    parentNode.textContent = newValue ?? currentValue;
  }

  editCell(e, tHead) {
    const { target } = e;

    const columnIdx = target.cellIndex;
    const columnType = tHead.rows[0].cells[columnIdx].textContent.toLowerCase();
    const currentValue = target.textContent;

    const input = CellEdit.#createInput(columnType);

    input.setAttribute('placeholder', currentValue);

    target.textContent = null;
    target.append(input);

    input.focus();

    input.addEventListener('keypress', (pressEvent) => {
      if (pressEvent.key === 'Enter') {
        input.blur();
      }
    });

    input.addEventListener('blur', (blurEvent) => {
      CellEdit.#onCellBlur(blurEvent, columnType, currentValue);
    });
  }
}
