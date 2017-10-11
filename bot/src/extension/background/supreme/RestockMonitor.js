import RestocksService from '../../../services/supreme/RestocksService';
import StorageService from '../../../services/StorageService';

export default class RestockMonitor {
  constructor(intervalMs) {
    this.intervalMs = intervalMs;
    this.onNewProductsCallbacks = [];
    this.onProductRestockCallbacks = [];
  }

  addOnNewProductsListener(func) {
    this.onNewProductsCallbacks.push(func);
  }

  addOnProductRestockListener(func) {
    this.onProductRestockCallbacks.push(func);
  }

  async update() {
    const newStock = await RestocksService.fetchCurrentStock();
    const savedStock = await StorageService.getItem('stock');
    if (!savedStock) {
      await StorageService.setItem('stock', newStock);
      return;
    }
    const newProducts = newStock.filter(x => !savedStock.find(z => z.url === x.url));
    if (newProducts.length) {
      for (const callback of this.onNewProductsCallbacks) callback(newProducts);
    }

    for (let i = 0; i < newStock.length; i += 1) {
      const product = newStock[i];
      const existingProduct = savedStock.find(x => x.url === product.url);
      if (existingProduct && !product.soldOut && existingProduct.soldOut) {
        for (const callback of this.onProductRestockCallbacks) callback(product);
      }
    }
    await StorageService.setItem('stock', newStock);
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
