'use strict';

const selectedRow = () => {
  const table = document.querySelector('tbody');
  const rows = document.querySelectorAll('tr');

  table.addEventListener('click', (e) => {
    const line = e.target.parentElement;

    if (line.tagName === 'TR') {
      rows.forEach((row) => {
        row.classList.remove('active');
      });

      line.classList.add('active');
    }
  });
};

export default selectedRow;
