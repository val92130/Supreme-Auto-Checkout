import SupremeManager from './supreme';
import * as StorageManager from '../app/utils/StorageManager';
import { SHOP_NAME as SupremeName } from '../app/components/shops/Supreme';
import version from '../app/version';


async function Start() {
  const profile = await StorageManager.getCurrentProfileSettings(version);
  const settings = profile[SupremeName] || {};
  const manager = new SupremeManager(settings.Options, settings.Sizes, settings.Billing);
  manager.start();
}

Start();
