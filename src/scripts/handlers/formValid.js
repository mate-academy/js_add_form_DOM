import pushNotification from '../components/pushNotification';

const formValid = (form) => {
  const inputs = form.querySelectorAll('input');

  for (const input of [...inputs]) {
    if (input.name === 'name') {
      if (input.value.length < 4) {
        pushNotification(
          'Error!',
          `An error occurred while trying to add employee to the table.
          Reason: name is too short`,
          'error',
        );

        return false;
      }

      if (input.value.trim().length === 0) {
        pushNotification(
          'Error!',
          `An error occurred while trying to add employee to the table.
          Reason: name cannot contain only whitespaces`,
          'error',
        );

        return false;
      }
    }

    if (input.name === 'position') {
      if (!input.value.length) {
        pushNotification(
          'Error!',
          `An error occurred while trying to add employee to the table.
          Reason: choose position`,
          'error',
        );

        return false;
      }

      if (input.value.trim().length === 0) {
        pushNotification(
          'Error!',
          `An error occurred while trying to add employee to the table.
          Reason: position cannot contain only whitespaces`,
          'error',
        );

        return false;
      }
    }

    if (input.name === 'salary') {
      if (!input.value.length) {
        pushNotification(
          'Error!',
          `An error occurred while trying to add employee to the table.
          Reason: salary input cannot be empty`,
          'error',
        );

        return false;
      }
    }

    if (input.name === 'age') {
      if (+input.value < 18 || +input.value > 90) {
        pushNotification(
          'Error!',
          `An error occurred while trying to add employee to the table.
          Reason: age is not match the required range (18-90)`,
          'error',
        );

        return false;
      }
    }
  }

  pushNotification(
    'Success!',
    'The employee was successfully added to the table',
    'success',
  );

  return true;
};

export default formValid;
