import StorageService from '../StorageService';

export default class ProductWatcherService {
  static async getProducts() {
    return await StorageService.getItem('products');
  }

  static setProducts(products) {
    return StorageService.setItem('products', products);
  }
}
