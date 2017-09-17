import { getCurrentProfileSettings, getAtcProducts, getItem } from '../../app/utils/StorageManager';
import version from '../../app/version';
import * as menus from '../../app/constants/Menus';
import * as Helpers from '../../app/utils/Helpers';
import { findBestMatch } from '../helpers';
import { SHOP_NAME as SupremeName } from '../../app/components/shops/Supreme';
import ProductMonitorWorker from './productMonitorWorker';


async function getEnabledAtcProducts() {
  try {
    const atc = await getAtcProducts(version);
    if (atc && atc.atcProducts) {
      return atc.atcProducts.filter(x => x.enabled);
    }
    return [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

async function getSettings() {
  try {
    const profile = await getCurrentProfileSettings(version);
    return profile[SupremeName];
  } catch(e) {
    console.info('Error while getting settings');
    console.info(e);
    return null;
  }
}

async function processProducts(products) {
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    let category = product.category;
    if (category === 'tops-sweaters') {
      category = 'tops_sweaters';
    }
    const keywords = product.keywords;
    const color = product.color;
    let url = `http://supremenewyork.com/shop/all/${category}?atc-kw=${keywords.join(';')}`;
    if (color) {
      url = `${url}&atc-color=${color}`;
    }
    chrome.tabs.create({ url });
  }
}

async function processByMonitor(atcProducts) {
  const monitorProducts = await getItem('products');
  if (!monitorProducts) {
    return;
  }
  for (let i = 0; i < atcProducts.length; i += 1) {
    const product = atcProducts[i];
    const keywords = product.keywords;
    const color = product.color;
    const bestMatch = findBestMatch(monitorProducts, keywords, product.category);
    if (bestMatch) {
      chrome.tabs.create({ url: `http://supremenewyork.com/shop/${bestMatch.id}?atc-color=${color}` });
    }
  }
}

function isEnabled(settings) {
  return settings && settings[menus.MENU_OPTIONS] && settings[menus.MENU_OPTIONS].atcEnabled;
}

function getAtcStartTime(settings) {
  if (!settings || !settings[menus.MENU_OPTIONS]) {
    return null;
  }
  const atcStartTime = settings[menus.MENU_OPTIONS].atcStartTime;
  const atcStartDate = settings[menus.MENU_OPTIONS].atcStartDate;
  if (!atcStartTime || !atcStartDate) {
    return null;
  }
  const time = Helpers.timeToDate(atcStartTime);
  const currDate = new Date(atcStartDate);
  currDate.setHours(time.getHours());
  currDate.setMinutes(time.getMinutes());
  currDate.setSeconds(time.getSeconds());
  return currDate;
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
  const settings = await getSettings();
  if (!isEnabled(settings)) {
    await timeout(1000, () => loop());
    return;
  }
  const now = new Date();
  const startTime = getAtcStartTime(settings);
  if (!startTime || !Helpers.sameDay(now, startTime)) {
    await timeout(1000, () => loop());
    return;
  }
  const diffTime = (startTime.getTime() - now.getTime()) / 1000;
  console.log(`ATC starting in ${diffTime} seconds...`);

  if (diffTime <= 0 && Math.abs(diffTime) < 3) {
    const products = await getEnabledAtcProducts();
    if (settings.Options.atcUseMonitor) {
      await processByMonitor(products);
    } else {
      await processProducts(products);
    }
    await timeout(4000, () => loop());
    return;
  }
  await timeout(1000, () => loop());
}


async function start() {
  const worker = new ProductMonitorWorker();
  worker.start();
  await loop();
}

start();
