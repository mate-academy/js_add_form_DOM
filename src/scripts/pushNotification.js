'use strict';

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.classList.add('notification');
  message.classList.add(type);
  message.style.right = `${posRight}px`;
  message.style.top = `${posTop}px`;
  message.style.transition = `opacity 0.5s`;

  message.innerHTML = `
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.style.opacity = '0';
  }, 2000);

  setTimeout(() => {
    message.remove();
  }, 2500);
};

module.exports = { pushNotification };
