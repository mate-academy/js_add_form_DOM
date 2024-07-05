const dataValidation = (inputName, value) => {
  if (inputName === 'name') {
    return value.trim().length >= 4;
  }

  if (inputName === 'age') {
    return Number(value) >= 18 && Number(value) <= 90;
  }

  if (value.trim().length === 0) {
    return false;
  }

  return true;
};

export default dataValidation;
