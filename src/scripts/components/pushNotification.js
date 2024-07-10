const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.style.cssText = `
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    text-align: center;
  `;

  notification.innerHTML = `<h2 class="title">${title}</h2><p>${description}</p>`;
  notification.classList = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2500);
};

export default pushNotification;
