class BaseManager {
  constructor() {
    this.notificationBar = this.createNotificationBar();
  }

  start() {
    // Checks for page change by repetidly checking the current page location and tracking change
    (() => {
      var currentPage = window.location.href;
      setInterval(() => {
        this.updateNotificationBar();
        if (currentPage != window.location.href) {
          currentPage = window.location.href;
          setTimeout(() => this.onPageChange(), 100);
        }
      }, 50);
      this.updateNotificationBar();
      this.onPageChange();
    })();
  }

  updateNotificationBar() {
    if (document.getElementById('sup-notif-bar')) return;
    let notificationBar = document.createElement("div");
    notificationBar.style.width = '100%';
    notificationBar.style.textAlign = 'center';
    notificationBar.style.backgroundColor = '#cbffcd';
    notificationBar.style.lineHeight = '50px';
    notificationBar.style.height = '50px';
    notificationBar.style.fontSize = 'medium';
    notificationBar.id = "sup-notif-bar";
    document.body.prepend(notificationBar);
  }

  /**
   * Helper timeout function to add a timer in the notification bar
   * @param  {Function} fn Function to be called after the delay
   * @param  {Number} ms Delay before calling the function
   * @param  {String} actionName Optional, an action name that will be displayed in the notification bar
   */
  timeout(fn, ms, actionName) {
    const now = new Date();
    let shouldAbort = false;
    let currentLocation = document.location.href;

    let interval = setInterval(() => {
      if (currentLocation !== document.location.href) {
        shouldAbort = true;
        clearInterval(interval);
        return;
      }
      const d = new Date();
      const diff = (d.getTime() - now.getTime());
      this.setNotificationBarText((actionName || 'Action') + ' in : ' + ((ms - diff) / 1000));
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      if (shouldAbort || currentLocation !== document.location.href) {
        return;
      }
      this.setNotificationBarText('Done');
      fn();
    }, ms);
  }

  createNotificationBar() {
    let notificationBar = document.createElement("div");
    notificationBar.style.width = '100%';
    notificationBar.style.textAlign = 'center';
    notificationBar.style.backgroundColor = '#cbffcd';
    notificationBar.style.lineHeight = '50px';
    notificationBar.style.height = '50px';
    notificationBar.style.fontSize = 'medium';
    notificationBar.id = "sup-notif-bar";
    document.body.prepend(notificationBar);
    return notificationBar;
  }

  /**
   * Sets top notification bar text
   * @param  {} text The new text for the notification bar
   */
  setNotificationBarText(text) {
    this.notificationBar.textContent = text;
  }

  onPageChange() {

  }
}