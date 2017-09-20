import SupremeManager from './supreme';
import * as StorageManager from '../app/utils/StorageManager';
import version from '../app/version';
import { notify } from './notification';


async function Start() {
  const profile = await StorageManager.getCurrentProfileSettings(version);
  if (!profile || !profile.Supreme) {
    notify('Open the extension to configure the bot');
    return;
  }
  const settings = profile.Supreme;
  const manager = new SupremeManager(settings.Options, settings.Sizes, settings.Billing);
  manager.start();
}

Start();
