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
  notificationBar.style.position = 'fixed';
  notificationBar.id = 'sup-notif-bar';
  document.body.prepend(notificationBar);

  document.documentElement.style.marginTop = '60px';
  return notificationBar;
}

export function getOrCreateNotificationBar() {
  if (!document.getElementById('sup-notif-bar')) {
    createNotificationBar();
  }
  return document.getElementById('sup-notif-bar');
}

export function notify(text, danger = false) {
  const notificationBar = getOrCreateNotificationBar();
  if (danger) {
    notificationBar.style.backgroundColor = 'rgba(255, 58, 58, 0.42)';
  } else {
    notificationBar.style.backgroundColor = 'rgba(58, 255, 91, 0.42)';
  }
  notificationBar.textContent = text;
}
