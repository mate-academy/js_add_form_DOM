'use strict';

export const setActiveRowHandler = () => {
  const table = document.querySelector('tbody');

  table.addEventListener('click', (e) => {
    const rows = [...table.rows];

    const row = e.target.parentElement;

    if (row.tagName !== 'TR' || row.className === 'active') {
      return;
    }

    rows.forEach((element) => {
      element.classList.remove('active');
    });

    row.classList.add('active');
  });
};
