function createNotificationBar() {
  const notificationBar = document.createElement('div');
  notificationBar.style.width = '100%';
  notificationBar.style.marginLeft = 'auto';
  notificationBar.style.marginRight = 'auto';
  notificationBar.style.textAlign = 'center';
  notificationBar.style.lineHeight = '60px';
  notificationBar.style.height = '60px';
  notificationBar.style.fontSize = '1.6em';
  notificationBar.style.zIndex = '9999';
  notificationBar.style.left = 0;
  notificationBar.style.top = 0;
  notificationBar.id = 'notification-bar';
  document.body.prepend(notificationBar);
  return notificationBar;
}

export function getOrCreateNotificationBar() {
  if (!document.getElementById('notification-bar')) {
    createNotificationBar();
  }
  return document.getElementById('notification-bar');
}

export function notify(text, danger = false) {
  const notificationBar = getOrCreateNotificationBar();
  if (danger) {
    notificationBar.style.backgroundColor = 'rgba(255, 58, 58, 0.42)';
  } else {
    notificationBar.style.backgroundColor = 'rgba(8, 107, 185, 0.42)';
  }
  notificationBar.textContent = text;
}
