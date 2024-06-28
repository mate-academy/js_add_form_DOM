function isValid(fieldName, value) {
  switch (fieldName) {
    case 'name':
      return value.trim().length >= 4;

    case 'position':
      return !!value.trim();

    case 'office':
      return true;

    case 'age':
      return value >= 18 && value < 90;

    case 'salary':
      return value >= 0 && value;

    default:
      break;
  }
}

export const validateFormData = {
  isValid,
};
