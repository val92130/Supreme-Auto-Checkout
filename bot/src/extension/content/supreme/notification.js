function createNotificationBar() {
  const notificationBar = document.createElement('div');
  notificationBar.style.width = '100%';
  notificationBar.style.marginLeft = 'auto';
  notificationBar.style.marginRight = 'auto';
  notificationBar.style.textAlign = 'center';
  notificationBar.style.backgroundColor = 'rgba(255, 58, 58, 0.42)';
  notificationBar.style.lineHeight = '60px';
  notificationBar.style.height = '60px';
  notificationBar.style.fontSize = '1.6em';
  notificationBar.style.zIndex = '9999';
  notificationBar.style.left = 0;
  notificationBar.style.top = 0;
  notificationBar.id = 'sup-notif-bar';
  document.body.prepend(notificationBar);
  return notificationBar;
}

export function getOrCreateNotificationBar() {
  if (!document.getElementById('sup-notif-bar')) {
    createNotificationBar();
  }
  return document.getElementById('sup-notif-bar');
}

export function notify(text) {
  const notificationBar = getOrCreateNotificationBar();
  notificationBar.textContent = text;
}
