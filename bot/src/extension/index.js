import SupremeManager from './supreme';
import * as StorageManager from '../app/utils/StorageManager';
import { SHOP_NAME as SupremeName } from '../app/components/shops/Supreme';


async function Start() {
  const settings = (await StorageManager.getFromChromeStorage('settings'))[SupremeName] || {};
  const manager = new SupremeManager(settings.Options, settings.Sizes, settings.Billing);
  manager.start();
}

Start();
