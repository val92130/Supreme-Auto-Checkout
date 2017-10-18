export default class ChromeService {
  static isPopup() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('popup') === 'true';
  }

  static openOptionsPage(page = 'supreme') {
    window.open(chrome.runtime.getURL(`index.html#/${page}/`));
  }

  static createNotification(title, message, onClick) {
    const notification = new Notification(title, {
      icon: 'assets/img/icon.png',
      body: message,
    });
    if (onClick) {
      notification.onclick = () => onClick(notification);
    }
    setTimeout(() => {
      notification.close();
    }, 6000);
    return notification;
  }

  static sendMessage(key, data) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ key, data }, resolve);
    });
  }

  static addMessageBroadcastListener(func) {
    chrome.runtime.onMessage.addListener(func);
  }

  static addMessageListener(key, func) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.key === key) {
        func(request, sender, sendResponse);
      }
    });
  }
}
