'use strict';

const pushNotification = (posTop, posRight, title, description, type) => {
  const wrapper = document.createElement('div');

  wrapper.setAttribute('data-qa', 'notification');
  wrapper.classList.add(type, 'notification');
  wrapper.style.cssText = `top: ${posTop}px; right: ${posRight}px`;

  const blockTitle = document.createElement('h2');

  blockTitle.textContent = title;
  blockTitle.classList.add('title');
  wrapper.append(blockTitle);

  const blockDescription = document.createElement('p');

  blockDescription.textContent = description;
  wrapper.append(blockDescription);

  document.body.append(wrapper);

  setTimeout(() => {
    wrapper.style.opacity = 0;
  }, 2000);
};

export default pushNotification;
