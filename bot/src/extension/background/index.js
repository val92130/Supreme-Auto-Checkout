import SupremeBackground from './supreme/index';
import RestockMonitor from './supreme/RestockMonitor';
import StorageService from '../../services/StorageService';
import ChromeService from '../../services/ChromeService';

async function updateRestockList(products, type) {
  let restockList = await StorageService.getItem('restocks');
  const entries = [];
  for (const product of products) {
    entries.push({
      type,
      product,
      timestamp: new Date().getTime(),
    });
  }

  if (!restockList) {
    await StorageService.setItem('restocks', entries);
    return;
  }
  restockList.push(...entries);
  restockList = restockList.sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  }).splice(0, 100);
  await StorageService.setItem('restocks', restockList);
}

async function getSettings() {
  try {
    const profile = await StorageService.getCurrentProfileSettings();
    return profile.Supreme;
  } catch(e) {
    console.info('Restock monitor ---- Error while getting settings, bot is not yet configured');
    console.info(e);
    return null;
  }
}

async function canDisplayNotifications() {
  const settings = await getSettings();
  if (!settings) return false;
  return settings.Options && settings.Options.showNotifications;
}

async function createNotification(title, content, callback) {
  if (await canDisplayNotifications()) {
    ChromeService.createNotification(title, content, callback);
  }
}

async function onNewProducts(products) {
  await updateRestockList(products, 'new');
  if(products.length > 3) {
    await createNotification('New products', `${products.length} new products just landed on the store!`, (notif) => {
      window.open('https://www.supremenewyork.com/shop/new');
      notif.close();
    });
  } else {
    for (let product of products) {
      await createNotification('New product', `Product ${product.name} just landed on the store!`, (notif) => {
        window.open(product.url);
        notif.close();
      });
    }
  }
  ChromeService.sendMessage('productsAdded', { products });
}

async function onProductsRestock(products) {
  await updateRestockList(products, 'restock');
  for (let i = 0; i < products.length; i += 1) {
    const product = products[i];
    ChromeService.sendMessage('productRestocked', { product });
    await createNotification('Restock alert', `${product.name} in ${product.color} is back in stock!`, (notif) => {
      window.open(product.url);
      notif.close();
    });
  }
}

async function start() {
  const monitor = new RestockMonitor(10000);
  monitor.addOnNewProductsListener(async products => await onNewProducts(products));
  monitor.addOnProductsRestockListener(async products => await onProductsRestock(products));
  monitor.start();
  await SupremeBackground();
}
start();
