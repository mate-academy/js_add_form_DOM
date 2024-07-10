import { variables } from './../config/variables';
import normalize from './normalize';

const sortBySalary = (columnIndex, rows) => {
  if (columnIndex !== variables.currentColumnIndex) {
    variables.asc = true;
  }

  rows.sort((a, b) => {
    const salaryA = normalize(a.children[columnIndex].textContent);
    const salaryB = normalize(b.children[columnIndex].textContent);

    return variables.asc ? salaryA - salaryB : salaryB - salaryA;
  });

  variables.asc = !variables.asc;
  variables.currentColumnIndex = columnIndex;
};

export default sortBySalary;
