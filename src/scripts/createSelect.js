'use strict';

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const createOptions = (towns) =>
  towns.map((el) => `<option value="${el}">${el}</option>`).join(' ');

export const createHTMLSelect = (selectName) => {
  const capitalizedSelectName =
    selectName[0].toUpperCase() + selectName.slice(1);

  return `
    <label>${capitalizedSelectName}:
        <select name=${selectName} data-qa=${selectName}>
          ${createOptions(cities)}
        </select>
      </label>
  `;
};
