export class FormNotification {
  notification = null;

  #createNotification(type = '') {
    const notification = document.createElement('div');

    notification.classList.add(type, 'notification');
    notification.setAttribute('data-qa', 'notification');

    this.notification = notification;

    return this;
  }

  #createTitle(titleText) {
    const title = document.createElement('h2');

    title.classList.add('title');
    title.textContent = titleText;

    this.notification.append(title);

    return this;
  }

  #createMessage(messageText) {
    const message = document.createElement('p');

    message.textContent = messageText;
    this.notification.append(message);

    return this;
  }

  #mountNotification() {
    document.body.append(this.notification);

    return this;
  }

  #unmountNotification() {
    const timeoutId = setTimeout(() => {
      this.notification.style.display = 'none';
      clearTimeout(timeoutId);
    }, 2000);
  }

  showNotification({ type, title, message }) {
    this.#createNotification(type)
      .#createTitle(title)
      .#createMessage(message)
      .#mountNotification()
      .#unmountNotification();
  }
}
