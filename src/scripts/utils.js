export const HEADER_NAME = 'name';
export const HEADER_POSITION = 'position';
export const HEADER_OFFICE = 'office';
export const HEADER_AGE = 'age';
export const HEADER_SALARY = 'salary';

export const ORDER_ASC = 'asc';
export const ORDER_DESC = 'desc';

export const TAG_INPUT = 'input';
export const TAG_SELECT = 'select';

export const TYPE_TEXT = 'text';
export const TYPE_NUMBER = 'number';

export const OFFICE_OPTIONS = [
  'Tokyo',
  'Singapure',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

export const ERROR_TITLE = 'Error';
export const SUCCES_TITLE = 'Success';
export const MIN_TEXT_LENGTH = 4;
export const MAX_TEXT_LENGTH = 30;
export const MIN_AGE = 18;
export const MAX_AGE = 90;

export const SUCCESS_MESSAGE = 'Employee added successfully';

export const ERRORS = {
  MIN_TEXT_LENGTH: (fieldName) =>
    `${fieldName} must be at least ${MIN_TEXT_LENGTH} characters long`,
  MAX_TEXT_LENGTH: (fieldName) =>
    `${fieldName} must be less than ${MAX_TEXT_LENGTH} characters long`,
  INVALID_NUMBER: (fieldName) =>
    `${fieldName} must be a positive number without any other characters`,
  INVALID_AGE: (fieldName) =>
    `${fieldName} must be between ${MIN_AGE} and ${MAX_AGE}`,
};

export const employeeFields = [
  {
    tag: TAG_INPUT,
    nameValue: HEADER_NAME,
    type: TYPE_TEXT,
    required: true,
  },
  {
    tag: TAG_INPUT,
    nameValue: HEADER_POSITION,
    type: TYPE_TEXT,
    required: true,
  },
  {
    tag: TAG_SELECT,
    nameValue: HEADER_OFFICE,
    required: true,
    options: OFFICE_OPTIONS,
  },
  {
    tag: TAG_INPUT,
    nameValue: HEADER_AGE,
    type: TYPE_NUMBER,
    required: true,
  },
  {
    tag: TAG_INPUT,
    nameValue: HEADER_SALARY,
    type: TYPE_NUMBER,
    required: true,
  },
];
