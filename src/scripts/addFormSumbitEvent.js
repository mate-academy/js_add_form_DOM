'use strict';

import { addNewEmployee } from './addNewEmployee';
import { showNotification } from './showNotification';
import { ERROR_TITLE, SUCCESS_MESSAGE, SUCCES_TITLE } from './utils';
import { validateNumber, validateText } from './validation';

export function addFormSubmitEvent(form) {
  form.onsubmit = (e) => {
    e.preventDefault();

    for (const element of form.elements) {
      if (element.type === 'submit') {
        continue;
      }

      let error;

      switch (element.type) {
        case 'text':
          error = validateText(element);
          break;
        case 'number':
          error = validateNumber(element);
          break;
      }

      if (error) {
        showNotification(ERROR_TITLE, error, false);

        return;
      }
    }

    addNewEmployee(form.elements);

    showNotification(SUCCES_TITLE, SUCCESS_MESSAGE, true);
    form.reset();
  };
}
