'use strict';

const TITLE_CLASS = 'title';
const SUCCESS_CLASS = 'success';
const ERROR_CLASS = 'error';
const NOTIFICATION_CLASS = 'notification';
const NOTIFICATION_DATA_QA = 'notification';
const NOTIFICATION_TIMEOUT = 3000;

function removeNotification(notification) {
  document.body.removeChild(notification);
}

function createTitle(titleName) {
  const title = document.createElement('h3');

  title.textContent = titleName;
  title.className = TITLE_CLASS;

  return title;
}

function createMessage(message) {
  const paragraph = document.createElement('p');

  paragraph.textContent = message;

  return paragraph;
}

export function showNotification(titleName, message, isSuccess) {
  const notification = document.createElement('div');
  const title = createTitle(titleName);
  const paragraph = createMessage(message);

  notification.dataset.qa = NOTIFICATION_DATA_QA;

  notification.classList.add(
    NOTIFICATION_CLASS,
    isSuccess ? SUCCESS_CLASS : ERROR_CLASS,
  );

  notification.appendChild(title);
  notification.appendChild(paragraph);
  document.body.appendChild(notification);

  setTimeout(() => {
    removeNotification(notification);
  }, NOTIFICATION_TIMEOUT);
}
