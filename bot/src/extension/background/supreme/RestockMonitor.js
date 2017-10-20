import RestocksService from '../../../services/supreme/RestocksService';
import StorageService from '../../../services/StorageService';
import ChromeService from '../../../services/ChromeService';

export default class RestockMonitor {
  constructor(intervalMs) {
    this.intervalMs = intervalMs;
    this.onNewProductsCallbacks = [];
    this.onProductsRestockCallbacks = [];
  }

  addOnNewProductsListener(func) {
    this.onNewProductsCallbacks.push(func);
  }

  addOnProductsRestockListener(func) {
    this.onProductsRestockCallbacks.push(func);
  }

  async update() {
    const newStock = await RestocksService.fetchCurrentStock();
    const savedStock = await StorageService.getItem('stock');
    if (!savedStock) {
      for (const callback of this.onNewProductsCallbacks) callback(newStock);
      await StorageService.setItem('stock', newStock);
      return;
    }
    const newProducts = newStock.filter(x => !savedStock.find(z => z.url === x.url));
    if (newProducts.length) {
      for (const callback of this.onNewProductsCallbacks) callback(newProducts);
    }

    let restockedProducts = [];
    for (let i = 0; i < newStock.length; i += 1) {
      const product = newStock[i];
      const existingProduct = savedStock.find(x => x.url === product.url);
      if (existingProduct && !product.soldOut && existingProduct.soldOut) {
        restockedProducts.push(product);
      }
    }
    if (restockedProducts.length) {
      for (const callback of this.onProductsRestockCallbacks) callback(restockedProducts);
    }
    await StorageService.setItem('stock', newStock);
    ChromeService.sendMessage('stockUpdated', newStock);
  }

  start() {
    this.interval = setInterval(async () => await this.update(), this.intervalMs);
    this.update();
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
