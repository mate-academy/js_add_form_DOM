import {
  ERRORS,
  MAX_AGE,
  MAX_TEXT_LENGTH,
  MIN_AGE,
  MIN_TEXT_LENGTH,
} from './utils';

function normalizedText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function firstLetterToUpperCase(text) {
  return `${text[0].toUpperCase()}${text.slice(1)}`;
}

export function validateText(element) {
  const normalizedValue = normalizedText(element.value);

  if (normalizedValue.length < MIN_TEXT_LENGTH) {
    return ERRORS.MIN_TEXT_LENGTH(firstLetterToUpperCase(element.name));
  }

  if (normalizedValue.length > MAX_TEXT_LENGTH) {
    return ERRORS.MAX_TEXT_LENGTH(firstLetterToUpperCase(element.name));
  }

  return null;
}

export function validateNumber(element) {
  const numberValue = +element.value;

  if (!/^\d+$/.test(element.value)) {
    return ERRORS.INVALID_NUMBER(firstLetterToUpperCase(element.name));
  }

  if (
    element.name === 'age' &&
    (numberValue < MIN_AGE || numberValue > MAX_AGE)
  ) {
    return ERRORS.INVALID_AGE(firstLetterToUpperCase(element.name));
  }
}
