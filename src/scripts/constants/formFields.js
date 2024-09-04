import { countries } from './countries';

export const formFields = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Position', name: 'position', type: 'text' },
  {
    label: 'Country',
    name: 'office',
    type: 'select',
    options: countries,
  },
  { label: 'Age', name: 'age', type: 'number' },
  { label: 'Salary', name: 'salary', type: 'number' },
];
