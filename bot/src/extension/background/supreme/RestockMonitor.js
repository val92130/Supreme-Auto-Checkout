import RestocksService from '../../../services/supreme/RestocksService';
import StorageService from '../../../services/StorageService';

export default class RestockMonitor {
  constructor(intervalMs) {
    this.intervalMs = intervalMs;
    this.onNewProductCallbacks = [];
    this.onProductRestockCallbacks = [];
  }

  addOnNewProductListener(func) {
    this.onNewProductCallbacks.push(func);
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
    const newProducts = savedStock.filter(x => !newStock.find(z => z.url === x.url));
    for (const newProd of newProducts) {
      for (const callback of this.onNewProductCallbacks) callback(newProd);
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
