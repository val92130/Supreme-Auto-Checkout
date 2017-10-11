import SupremeBackground from './supreme/index';
import RestockMonitor from './supreme/RestockMonitor';
import StorageService from '../../services/StorageService';
import ChromeService from '../../services/ChromeService';

async function updateRestockList(product, type) {
  const restockList = await StorageService.getItem('restocks');
  const entry = {
    type,
    product,
    timestamp: new Date().getTime(),
  };
  if (!restockList) {
    await StorageService.setItem('restocks', [entry]);
    return;
  }
  restockList.push(entry);
  await StorageService.setItem('restocks', restockList);
}

async function onNewProduct(product) {
  ChromeService.createNotification('New product', `Product ${product.name} just landed on the store!`, (notif) => {
    window.open(`http://supremenewyork.com/${product.url}`);
    notif.close();
  });
  await updateRestockList(product, 'new');
}

async function onProductRestock(product) {
  ChromeService.createNotification('Restock alert', `${product.name} in ${product.color} is back in stock!`, (notif) => {
    window.open(`http://supremenewyork.com/${product.url}`);
    notif.close();
  });
  await updateRestockList(product, 'restock');
}

async function start() {
  const monitor = new RestockMonitor(10000);
  monitor.addOnNewProductListener(async product => await onNewProduct(product));
  monitor.addOnProductRestockListener(async product => await onProductRestock(product));
  monitor.start();
  await SupremeBackground();
}
start();
