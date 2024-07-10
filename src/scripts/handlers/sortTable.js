import { variables } from './../config/variables';
import sortBySalary from './../utils/sortBySalary';

const sortTable = (ev, table, ths) => {
  if (ths.includes(ev.target)) {
    const thIndex = ths.indexOf(ev.target);
    const rows = [...table.tBodies[0].rows];

    if (ths[thIndex].textContent === 'Salary') {
      sortBySalary(thIndex, rows);
    } else {
      if (thIndex !== variables.currentColumnIndex) {
        variables.asc = true;
      }

      rows.sort((rowA, rowB) => {
        const textA = rowA.children[thIndex].textContent;
        const textB = rowB.children[thIndex].textContent;

        if (!isNaN(textA) && !isNaN(textB)) {
          return variables.asc
            ? parseFloat(textA) - parseFloat(textB)
            : parseFloat(textB) - parseFloat(textA);
        } else {
          return variables.asc
            ? textA.localeCompare(textB)
            : textB.localeCompare(textA);
        }
      });

      variables.asc = !variables.asc;
    }
    variables.currentColumnIndex = thIndex;

    rows.forEach((row) => {
      table.tBodies[0].appendChild(row);
    });
  }
};

export default sortTable;
