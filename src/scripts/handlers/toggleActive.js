const toggleActive = (ev, table) => {
  if (ev.target.nodeName === 'TD') {
    ev.target.parentNode.classList.toggle('active');

    const activeRow = [...table.rows].indexOf(ev.target.parentNode);

    [...table.rows].forEach((row, index) => {
      if (index !== activeRow) {
        table.rows[index].classList.remove('active');
      }
    });
  }
};

export default toggleActive;
