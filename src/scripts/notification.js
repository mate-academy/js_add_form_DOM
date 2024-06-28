'use strict';

export const pushNotification = (
  posTop,
  posRight,
  title,
  description,
  type,
) => {
  const body = document.querySelector('body');
  const notification = document.createElement('div');

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  notification.insertAdjacentHTML(
    'afterbegin',
    `<h2 class="title">${title}</h2>`,
  );
  notification.insertAdjacentHTML('beforeend', `<p>${description}</p>`);

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');

  switch (type) {
    case 'success':
      notification.classList.add('success');
      break;

    case 'warning':
      notification.classList.add('warning');
      break;

    default:
      notification.classList.add('error');
  }

  body.appendChild(notification);

  setTimeout(() => notification.remove(), 4000);
};
