import AdidasManager from './AdidasManager';
import { notify } from '../notification';

export default class AdidasExtension {
  start(profile) {
    if (!profile || !profile.Adidas) {
      notify('Open the extension to configure your adidas bot', true);
      return;
    }
    const settings = profile.Supreme;
    const manager = new AdidasManager(settings.Options, settings.Sizes, settings.Billing);
    manager.start();
  }
}
