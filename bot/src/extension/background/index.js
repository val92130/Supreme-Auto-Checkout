import { getFromChromeStorage } from '../../app/utils/StorageManager';
import * as menus from '../../app/constants/Menus';
import * as Helpers from '../../app/utils/Helpers';


async function getEnabledAtcProducts() {
  const atc = await getFromChromeStorage('atc');
  if (atc && atc.atcProducts) {
    return atc.atcProducts.filter(x => x.enabled);
  }
  return [];
}

async function getSettings() {
  const settings = await getFromChromeStorage('settings');
  if (settings && settings['Supreme']) {
    return settings['Supreme'];
  }
  return null;
}

async function processProducts(products) {
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    const category = product.category;
    const keywords = product.keywords;
    chrome.tabs.create({ url: `http://supremenewyork.com/shop/all/${category}?atc-kw=${keywords.join(';')}` });
  }
}

function getAtcStartTime(settings) {
  if (!settings || !settings[menus.MENU_OPTIONS] || !settings[menus.MENU_OPTIONS].atcEnabled) {
    return null;
  }
  const atcStartTime = settings[menus.MENU_OPTIONS].atcStartTime;
  if (!atcStartTime) {
    return null;
  }
  return Helpers.setTimeForToday(atcStartTime);
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

async function timeout(ms, callback) {
  await sleep(ms);
  callback();
}

async function loop() {
  const now = new Date();
  const settings = await getSettings();
  const startTime = getAtcStartTime(settings);
  if (!startTime) {
    await timeout(1000, () => loop());
    return;
  }
  const diffTime = (startTime.getTime() - now.getTime()) / 1000;
  console.log(`ATC starting in ${diffTime} seconds...`);

  if (diffTime <= 0 && Math.abs(diffTime) < 3) {
    const products = await getEnabledAtcProducts();
    await processProducts(products);
    await timeout(4000, () => loop());
    return;
  }
  await timeout(1000, () => loop());
}


async function start() {
  await loop();
}

start();
