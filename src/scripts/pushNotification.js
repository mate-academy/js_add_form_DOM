export const pushNotification = (
  posTop,
  posRight,
  title,
  description,
  type,
) => {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.insertAdjacentHTML(
    'afterbegin',
    `
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    `,
  );

  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};
