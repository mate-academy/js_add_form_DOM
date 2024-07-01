export function setActiveRow(target, tBody) {
  [...tBody.rows].forEach((row) => row.classList.remove('active'));
  target.closest('tr').classList.add('active');
}

export function formatToCurrency(value) {
  return `$${Number(value).toLocaleString('en-US')}`;
}

export function capitalizeFirstLetter(string) {
  if (!string) {
    return;
  }

  if (typeof string !== 'string') {
    return string;
  }

  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}
