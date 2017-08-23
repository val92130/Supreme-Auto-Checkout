export default class BaseManager {
  constructor() {
    this.notificationBar = this.createNotificationBar();
  }

  start() {
    // Checks for page change by repeatedly checking the current page location and tracking change
    (() => {
      let currentPage = window.location.href;
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
    return this.createNotificationBar();
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
    notificationBar.style.backgroundColor = 'rgba(203, 255, 205, 0.38)';
    notificationBar.style.lineHeight = '50px';
    notificationBar.style.height = '50px';
    notificationBar.style.fontSize = 'medium';
    notificationBar.style.zIndex = '9999';
    notificationBar.style.position = 'absolute';
    notificationBar.style.left = 0;
    notificationBar.style.top = 0;
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

  sizeMatch(sizeA, sizeB, category) {
    sizeA = sizeA.toString().toLowerCase();
    sizeB = sizeB.toString().toLowerCase();
    if (!sizeB || !sizeA) return false;

    if (sizeA === sizeB) {
      return true;
    }

    if (category === "shoes") {
      // Match sizes like UK10/US10.5'
      const a = sizeA.split(/(?:\/)+/);
      const b = sizeB.split(/(?:\/)+/);

      if (a.some(x => b.indexOf(x) !== -1)) {
        return true;
      }
      return a[0].replace(/\D/g, '') === b[0].replace(/\D/g, '');
    }

    if (!isNaN(sizeA) || !isNaN(sizeB)) return false;

    // Match sizes like 'S/M';
    const splitA = sizeA.split('/');
    const splitB = sizeB.split('/');

    return splitA.some(x => sizeB[0] === x[0]) || splitB.some(x => sizeA[0] === x[0]);
  }
}
