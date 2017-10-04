export default class ChromeService {
  static isPopup() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('popup') === 'true';
  }

  static openOptionsPage(page = 'supreme') {
    window.open(chrome.runtime.getURL(`index.html#/${page}/`));
  }
}
