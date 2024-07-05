const SELECT_OPTIONS = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const createSelect = () => {
  const selectTag = document.createElement('select');

  const defaultOptionTag = document.createElement('option');

  defaultOptionTag.disabled = true;
  defaultOptionTag.selected = true;
  defaultOptionTag.value = '';
  defaultOptionTag.textContent = 'Choose the office';

  selectTag.append(defaultOptionTag);

  SELECT_OPTIONS.forEach((office) => {
    const optionTag = document.createElement('option');

    optionTag.value = office;
    optionTag.textContent = office;
    selectTag.append(optionTag);
  });

  return selectTag;
};

export default createSelect;
